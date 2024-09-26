import { cleanEnv, email, num, str } from 'envalid';
import dotenv from 'dotenv';
dotenv.config();

// Validate and load environment variables
export const appEnv = cleanEnv(process.env, {
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production', 'test'],
  }),
  DATABASE_URL: str({ desc: 'Please provide DB URL' }),
  SEED_PASSWORD: str({ default: 'SamLauncher@123' }),
  SEED_EMAIL: email({ default: 'example@exanple.com' }),
  TIMEOUT: num({ default: 5000 }),
  API_BASE_URL: str({ default: 'http://localhost:4000' }),
});
