import { Router } from 'express';
import { ChatController } from '../controllers/chatController';

const Chatrouter = Router();

Chatrouter.post('/message', ChatController.sendMessage);
Chatrouter.get('/history', ChatController.getChatHistory);
Chatrouter.get('/:sessionId', ChatController.getSessionMessages); 

export default Chatrouter;