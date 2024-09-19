import { cleanEnv, str, email, num } from 'envalid'

export const appEnv = cleanEnv(process.env, {
  PORT: num({ default: 4000 }),
  ADMIN_EMAIL: email({ default: 'admin@example.com' }),
  NODE_ENV: str({ default: 'development', choices: ['development', 'test', 'production', 'staging'] }),
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
