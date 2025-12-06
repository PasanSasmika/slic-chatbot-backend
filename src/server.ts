import app from './app'; // <--- IMPORT THE APP YOU CONFIGURED ABOVE
import { config } from './config/env';
import { connectDB } from './config/database';

const startServer = async () => {
  // 1. Connect to Database first
  await connectDB(); 
  
  // 2. Start the imported App
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`🔒 JWT Mode Enabled`);
    console.log(`📡 Routes initialized: /api/chat/message`);
  });
};

startServer();