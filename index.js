import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

import { createQuizRouter } from './routes/quiz.js';
import { createClassRoomRouter } from './routes/clasroom.js';
import { corsMiddleware } from './middleware/cors.js';
import setupSocket from './sockets/index.js';

export const createApp = ({ quizModel, classRoomModel }) => {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    app.set('io', io);

    // Middleware
    app.use(express.json());
    app.use(corsMiddleware());
    app.disable('x-powered-by');

    // Routes
    app.use('/v1/quizzes', createQuizRouter({ quizModel: quizModel }));
    app.use('/v1/classroom', createClassRoomRouter({ classRoomModel: classRoomModel }));

    // Socket.io setup
    setupSocket({io:io, quizModel: quizModel, classRoomModel: classRoomModel});

    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });

    const PORT = process.env.PORT ?? 3000;

    server.listen(PORT, () => {
      console.log(`server listening on port http://localhost:${PORT}`)
    })
}


