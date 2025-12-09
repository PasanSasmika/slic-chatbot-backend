import { Request, Response } from 'express';
import { DataIngestionService } from '../services/dataIngestionService';

export const AdminController = {
  async uploadDataset(req: Request, res: Response) {
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No CSV file uploaded" });
      }

      const { tableName } = req.body;
      const allowedTables = ['insurance_plans', 'insurance_rates', 'knowledge_base', 'web_links','customers','customer_policies','claims','policy_renewals'];

      if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: "Invalid Table Name. Access Denied." });
      }

      const result = await DataIngestionService.processUpload(req.file.path, tableName);

      return res.json({
        success: true,
        message: "Dataset imported successfully",
        details: result
      });

    } catch (error) {
      console.error("Upload Error:", error);
      return res.status(500).json({ error: "Data Ingestion Failed. Check CSV format." });
    }
  }
};