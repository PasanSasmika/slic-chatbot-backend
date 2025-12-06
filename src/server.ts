import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { connectDB } from './config/database';

const app: Application = express();

// Middleware
app.use(express.json()); // Parse JSON body
app.use(cors());         // Allow Frontend access
app.use(helmet());       // Security Headers
app.use(morgan('dev'));  // Logging

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'online', system: 'CoverChat AI Backend' });
});

const startServer = async () => {
  await connectDB(); 
  
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`🔒 JWT Mode Enabled`);
  });
};

startServer();