import { cleanEnv, str, email, num, bool } from 'envalid';

export const appEnv = cleanEnv(process.env, {
  DATABASE_URL: str({
    default:
      'postgresql://nodeProdUser:postgresPasswword@localhost:5433/nest_starter',
  }),
  PORT: num({ default: 4000 }),
  ADMIN_EMAIL: email({ default: 'admin@example.com' }),
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'test', 'production', 'staging'],
  }),
  SEED_PASSWORD: str({ default: 'SamLauncher@123' }),
  SEED_EMAIL: email({ default: 'example@team930312.testinator.com' }),
  JSON_TOKEN_SECRET: str({ default: 'SamLauncher@123' }),
  CORS_ORIGIN: str({
    default: '*',
    desc: 'Comma separated list of origins examples http://localhost:4000,http://localhost:3020',
  }),
  BACKEND_URL: str({ default: 'http://localhost:4000' }),
  FRONTEND_URL: str({ default: 'http://localhost:3020' }),
  ACCESS_TOKEN_EXPIRY: str({ default: '30m' }),
  REFRESH_TOKEN_EXPIRY: num({ default: 7 }),
  OTP_FEATURE: bool({ default: false }),
  ACCOUNT_LOCK_TIME: num({ desc: 'Account lock time, in Min', default: 30 }),
  ACCOUNT_LOCK_ATTEMPT: num({ desc: 'Account lock attempts', default: 5 }),

  // SMTP
  SMTP_HOST: str({ desc: 'SMTP HOST', default: 'localhost' }),
  SMTP_USER: str({ desc: 'SMTP User', default: 'test' }),
  SMTP_PASSWORD: str({ desc: 'SMTP Password', default: 'test' }),
  SMTP_PORT: num({ desc: 'SMTP Port', default: 1025 }),
  SMTP_SENDER: str({ desc: 'Sender Email', default: 'nest-starter@example.com' }),

  //  Mail sending
  MAIL_FROM_USER: str({ default: 'example', desc: 'Mail from user' }),
  MAIL_FROM_EMAIL: str({ default: 'example@example.com', desc: 'Mail from email' }),

  // FRONTEND_URL
  SIGNUP_VERIFY_URL: str({
    default: '/verify-email',
    desc: 'Signup verify url',
  }),
  PASSWORD_RESET_URL: str({
    default: '/password-reset',
    desc: 'Password Reset URL',
  }),
  MEMBERSHIP_VERIFY_URL: str({
    default: '/membership-verify',
    desc: 'Membership Verify',
  }),

  // Error Logging
  SENTRY_URL: str({ default: '', desc: 'Please provide SENTRY URL' }),

  PRISMA_DEBUG: bool({ default: false }),

  // Rate Limit 
  THROTTLE_TTL: num({ default: 60000 }),
  THROTTLE_LIMIT: num({ default: 50 }),
  RATE_LIMIT_ENABLED: bool({ default: true }),

  // Pagination
  PAGE_SIZE: num({ default: 10 }),
});

export default appEnv;
