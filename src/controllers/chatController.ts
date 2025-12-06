import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';

export const ChatController = {
  async sendMessage(req: Request, res: Response) {
    try {
      const { message, sessionId } = req.body;

      if (!message || !sessionId) {
        return res.status(400).json({ error: "Message and Session ID are required" });
      }

      const aiResponse = await ChatService.processUserMessage(message, sessionId);

      return res.json({
        success: true,
        data: {
          user: message,
          ai: aiResponse
        }
      });

    } catch (error) {
      console.error("Chat Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};