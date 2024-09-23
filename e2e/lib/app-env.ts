import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

// Validate and load environment variables
export const appEnv = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development', choices: ['development', 'production', 'test'] }),

  API_BASE_URL: str({ default: 'https://jsonplaceholder.typicode.com' }),
});
