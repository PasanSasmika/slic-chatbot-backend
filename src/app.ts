import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import chatRoutes from './routes/chatRoutes';
import adminrouter from './routes/adminRoutes';

const app: Application = express();

// 1. Global Middleware
app.use(express.json()); 
app.use(cors());         
app.use(helmet());       
app.use(morgan('dev'));  

// 2. Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'online', system: 'CoverChat AI Backend' });
});

// 3. Mount API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminrouter); 
export default app;