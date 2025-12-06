import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || '',
    name: process.env.DB_NAME || 'coverchat_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  },
  geminiApiKey: process.env.GEMINI_API_KEY as string,
};

// Validation
if (!config.jwt.secret) {
  throw new Error('FATAL ERROR: JWT_SECRET is not defined in .env');
}