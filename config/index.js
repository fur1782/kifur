import 'dotenv/config';

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseOrigins = (value) =>
  value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

export const appConfig = {
  environment: process.env.NODE_ENV ?? 'development',
  port: parseInteger(process.env.PORT, 3000),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/kifur',
  cors: {
    enabled: process.env.CORS_ENABLED !== 'false',
    origins: parseOrigins(process.env.ALLOWED_ORIGINS),
  },
  rateLimit: {
    windowMs: parseInteger(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
    max: parseInteger(process.env.RATE_LIMIT_MAX, 120),
  },
  socket: {
    accessToken: process.env.SOCKET_ACCESS_TOKEN ?? null,
  },
};
