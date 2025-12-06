import express from 'express';
import Chatrouter from './routes/chatRoutes';

const app = express();
app.use(express.json());

app.use('/api/chat', Chatrouter);

export default app;