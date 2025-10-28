import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import { appConfig as defaultConfig } from './config/index.js';
import { createQuizRouter } from './routes/quiz.js';
import { createClassRoomRouter } from './routes/clasroom.js';
import { corsMiddleware } from './middleware/cors.js';
import setupSocket from './sockets/index.js';

export const createApp = ({ quizModel, classRoomModel, config = defaultConfig }) => {
  const app = express();
  const server = http.createServer(app);

  const socketCorsOrigin =
    config.cors.enabled === false
      ? false
      : config.cors.origins.length > 0
        ? config.cors.origins
        : true;

  const io = new Server(server, {
    cors: {
      origin: socketCorsOrigin,
      methods: ['GET', 'POST'],
    },
  });

  app.set('io', io);

  // Middleware
  app.use(helmet());
  app.use(express.json());
  app.use(corsMiddleware(config.cors));
  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );
  app.disable('x-powered-by');

  // Routes
  app.use('/v1/quizzes', createQuizRouter({ quizModel, config }));
  app.use('/v1/classroom', createClassRoomRouter({ classRoomModel, quizModel, config }));

  // Socket.io setup
  setupSocket({ io, classRoomModel, config });

  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  server.listen(config.port, () => {
    console.log(`server listening on port http://localhost:${config.port}`);
  });
};
