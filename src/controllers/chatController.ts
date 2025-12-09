import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { ChatRepo } from '../repositories/chatRepo';

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
  },

  async getChatHistory(req: Request, res: Response) {
    try {
      const sessions = await ChatRepo.getUserSessions();
      return res.json({ success: true, data: sessions });
    } catch (error) {
      console.error("History Error:", error);
      return res.status(500).json({ error: "Failed to fetch history" });
    }
  },

  async getSessionMessages(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const messages = await ChatRepo.getSessionMessages(sessionId);
      
      return res.json({ success: true, data: messages });
    } catch (error) {
      console.error("Fetch Error:", error);
      return res.status(500).json({ error: "Failed to load messages" });
    }
  }

};