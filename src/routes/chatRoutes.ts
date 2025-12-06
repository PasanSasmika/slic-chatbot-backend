import { Router } from 'express';
import { ChatController } from '../controllers/chatController';

const Chatrouter = Router();

Chatrouter.post('/message', ChatController.sendMessage);

export default Chatrouter;