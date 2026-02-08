export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === undefined) {
    // Initialize server/runtime Sentry as early as possible.
    void import('./sentry.server.config');
  }
}
