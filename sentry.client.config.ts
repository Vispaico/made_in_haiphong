'use client';

import * as Sentry from '@sentry/react';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
const tracesSampleRate = Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0.1');

Sentry.init({
  dsn: dsn || undefined,
  enabled: Boolean(dsn),
  environment: process.env.NODE_ENV,
  tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0,
  replaysOnErrorSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  debug: process.env.NODE_ENV === 'development',
});

Sentry.setTag('runtime', 'browser');
