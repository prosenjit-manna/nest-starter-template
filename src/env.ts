import { cleanEnv, str, email, num } from 'envalid'

export const appEnv = cleanEnv(process.env, {
  DATABASE_URL: str({ default: 'postgresql://nodeProdUser:postgresPasswword@localhost:5433/nest_starter' }),
  PORT: num({ default: 4000 }),
  ADMIN_EMAIL: email({ default: 'admin@example.com' }),
  NODE_ENV: str({ default: 'development', choices: ['development', 'test', 'production', 'staging'] }),
  SEED_PASSWORD: str({ default: 'SamLauncher@123' }),
  SEED_EMAIL: email({ default: 'example@exanple.com' }),
  JSON_TOKEN_SECRET: str({ default: 'SamLauncher@123' }),
  CORS_ORIGIN: str({ default: '*', desc: 'Comma separated list of origins examples http://localhost:4000,http://localhost:3000' }),
  BACKEND_URL: str({ default: 'http://localhost' }),
  FRONTEND_URL: str({ default: 'http://localhost:3000' }),
  ACCESS_TOKEN_EXPIRY: str({ default: '30m' }),

   // SMTP
   SMTP_HOST: str({ desc: 'SMTP HOST' }),
   SMTP_USER: str({ desc: 'SMTP User' }),
   SMTP_PASSWORD: str({ desc: 'SMTP Password' }),
   SMTP_PORT: num({ desc: 'SMTP Port' }),
   SMTP_SENDER: str({ desc: 'Sender Email' }),

  //  Mail sending
  MAIL_FROM_USER: str({ desc: 'Mail from user' }),
  MAIL_FROM_EMAIL: str({ desc: 'Mail from email' }),


  // FRONTEND_URL
  SIGNUP_VERIFY_URL: str({ default: '/verify-email/', desc: 'Signup verify url' }),
  PASSWORD_RESET_URL: str({ default: '/password-reset/', desc: 'Password Reset URL' }),
})

// Read an environment variable, which is validated and cleaned during
// and/or filtering that you specified with cleanEnv().
appEnv.ADMIN_EMAIL // -> 'admin@example.com'

// Envalid checks for NODE_ENV automatically, and provides the following
// shortcut (boolean) properties for checking its value:
appEnv.isProduction // true if NODE_ENV === 'production'
appEnv.isTest // true if NODE_ENV === 'test'
appEnv.isDev // true if NODE_ENV === 'development'

export default appEnv;
