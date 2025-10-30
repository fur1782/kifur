import cors from 'cors';

export const corsMiddleware = (corsConfig = {}) => {
  if (corsConfig.enabled === false) {
    return (_req, _res, next) => next();
  }

  const { origins = [] } = corsConfig;

  if (!origins || origins.length === 0) {
    return cors();
  }

  return cors({
    origin: origins,
  });
};
