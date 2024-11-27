import { bool, cleanEnv, email, num, str } from 'envalid';
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
  TESTINATOR_TEAM_ID: str({ default: 'team930312.testinator.com' }),
  SEED_EMAIL: email({ default: 'example@team930312.testinator.com' }),
  TIMEOUT: num({ default: 5000 }),
  TESTINATOR_API_KEY: str({ default: '6fd5ed52adf94184a9b562da180ea4f9' }),
  FETCH_EMAILS_INBOX: str({
    default: 'https://api.mailinator.com/api/v2/domains/private/inboxes?token=',
  }),
  FETCH_SPECIFIC_EMAIL: str({
    default: 'https://mailinator.com/api/v2/domains/private/messages/',
  }),
  API_BASE_URL: str({ default: 'http://localhost:4000' }),
  ADMIN_EMAIL: str({ default: 'example+admin-1@team930312.testinator.com' }),
  JEST_HTML_REPORTER_FILE_NAME: str({ default: 'test.html' }),
  // s3
  AWS_REGION: str({ default: 'us-east-1' }),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_BUCKET_NAME: str(),
  AWS_BUCKET_UPLOAD_PATH: str({ default: 'example' }),
  AWS_BUCKET_PUBLIC_URL: str(),
  AWS_REPORT_UPLOAD: bool({ default: false }),


  // Imap 
  IMAP_HOST: str({ default: 'imap.hostinger.com' }),
  IMAP_PORT: num({ default: 993 }),
  IMAP_TLS: bool({ default: true }),
  IMAP_USER: str(),
  IMAP_PASSWORD: str(),
});
