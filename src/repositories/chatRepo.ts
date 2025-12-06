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
  }
};