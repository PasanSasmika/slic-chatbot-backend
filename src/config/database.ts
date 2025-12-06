import mysql from 'mysql2/promise';
import { config } from './env';
// Create a Connection Pool (Better performance than single connections)
export const db = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.pass,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10, // Max 10 concurrent connections
  queueLimit: 0,
});

// Test Connection Function
export const connectDB = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};