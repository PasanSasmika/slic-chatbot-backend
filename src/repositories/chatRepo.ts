import { db } from '../config/database';
import { RowDataPacket } from 'mysql2';

export const ChatRepo = {
  async saveMessage(sessionId: string, role: 'user' | 'model', content: string) {
    await db.execute(
      `INSERT INTO chat_logs (session_id, role, message, created_at) VALUES (?, ?, ?, NOW())`,
      [sessionId, role, content]
    );
  },

  async getHistory(sessionId: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT role, message FROM chat_logs WHERE session_id = ? ORDER BY created_at ASC LIMIT 10`,
      [sessionId]
    );
    return rows.map(r => ({
      role: r.role,
      parts: [{ text: r.message }]
    }));
  },

  async getUserSessions() {
    // We group by session_id to find unique chats
    // We grab the first user message to use as the "Title"
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT session_id, 
              MIN(message) as title, 
              MAX(created_at) as last_active 
       FROM chat_logs 
       WHERE role = 'user' 
       GROUP BY session_id 
       ORDER BY last_active DESC`
    );
    return rows;
  },

  async getSessionMessages(sessionId: string) {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT role, message as content, created_at as timestamp 
       FROM chat_logs 
       WHERE session_id = ? 
       ORDER BY created_at ASC`,
      [sessionId]
    );
    return rows;
  }
};