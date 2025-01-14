import * as Sentry from "@sentry/nestjs"
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import appEnv from "src/env";

if (appEnv.SENTRY_URL) {
  Sentry.init({
    dsn: appEnv.SENTRY_URL,
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 0, //  Capture 100% of the transactions
  
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 0
  });
}
