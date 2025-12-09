import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../config/database';

export const DataIngestionService = {
  /**
   * Reads a CSV file and Upserts (Insert/Update) it into a target MySQL table.
   */
  async processUpload(filePath: string, tableName: string) {
    const results: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            if (results.length === 0) {
              return resolve({ message: "CSV file was empty." });
            }

            // 1. Get Columns from the first row
            const columns = Object.keys(results[0]);
            
            // 2. Format Values (Handle JSON strings)
            const values = results.map(row => {
              return columns.map(col => {
                let val = row[col];

                // Fix: If data looks like a Python/JSON list "['A','B']", clean quotes
                if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
                   try {
                     // Replace single quotes with double quotes for valid JSON
                     // But be careful not to break existing double quotes
                     if (val.includes("'")) {
                        val = val.replace(/'/g, '"'); 
                     }
                   } catch (e) {
                     // Keep as is if error
                   }
                }
                return val;
              });
            });

            // 3. INDUSTRIAL FIX: Generate "ON DUPLICATE KEY UPDATE" clause
            // This tells MySQL: "If ID 1 exists, update the other columns. Don't crash."
            const updateClause = columns
                .map(col => `${col}=VALUES(${col})`)
                .join(', ');

            const sql = `INSERT INTO ${tableName} (${columns.join(',')}) VALUES ? 
                         ON DUPLICATE KEY UPDATE ${updateClause}`;

            // 4. Execute Bulk Upsert (Transactional)
            const connection = await db.getConnection();
            await connection.beginTransaction();
            
            try {
              await connection.query(sql, [values]);
              await connection.commit();
              resolve({ success: true, count: results.length, action: "Upsert Completed" });
            } catch (err) {
              await connection.rollback();
              reject(err);
            } finally {
              connection.release();
              // Delete temp file to keep server clean
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }

          } catch (error) {
            // Ensure temp file is deleted even on error
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            reject(error);
          }
        })
        .on('error', (error) => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            reject(error);
        });
    });
  }
};