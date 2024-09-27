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
  SEED_EMAIL: email({ default: 'example@team930312.testinator.com' }),
  TIMEOUT: num({ default: 5000 }),
  API_KEY: str({ default: '6fd5ed52adf94184a9b562da180ea4f9' }),
  FETCH_EMAILS_INBOX: str({
    default: 'https://api.mailinator.com/api/v2/domains/private/inboxes?token=',
  }),
  FETCH_SPECIFIC_EMAIL: str({
    default: 'https://mailinator.com/api/v2/domains/private/messages/',
  }),
  API_BASE_URL: str({ default: 'http://localhost:4000' }),
});
