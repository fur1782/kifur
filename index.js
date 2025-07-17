import express from 'express';

import { createQuizRouter } from './routes/quiz.js';
import { corsMiddleware } from './middleware/cors.js';

export const createApp = ({ quizModel }) => {
    const app = express();

    // Middleware
    app.use(express.json());
    app.use(corsMiddleware());
    app.disable('x-powered-by');

    // Routes
    app.use('/v1/quizzes', createQuizRouter({ quizModel: quizModel }));

    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });

    const PORT = process.env.PORT ?? 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
};


