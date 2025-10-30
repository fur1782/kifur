import { Router } from 'express';
import { ClassRoomController } from '../controllers/classroom.js';
import { validateRequest } from '../middleware/validate.js';
import {
  roomIdParamsSchema,
  quizIdParamsSchema,
  sendAnswerBodySchema,
} from '../schema/http.js';

export const createClassRoomRouter = ({ classRoomModel, quizModel }) => {
  const classRoomRouter = Router();

  const classRoomController = new ClassRoomController({ classRoomModel, quizModel });

  // quizRouter.post("/init",));
  // quizRouter.post("/answer", );
  // No sé si utilitzar REST API per aquesta funcionalitat, jo crec que podem fer-ho directament amb WS
  // quizRouter.get("/join/:id", );
  classRoomRouter.post(
    '/:roomId/answer',
    validateRequest({ params: roomIdParamsSchema, body: sendAnswerBodySchema }),
    classRoomController.sendAnswer,
  );
  classRoomRouter.post(
    '/:roomId/end',
    validateRequest({ params: roomIdParamsSchema }),
    classRoomController.finishGame,
  );
  classRoomRouter.get('/all', classRoomController.getClassrooms);
  classRoomRouter.get(
    '/start/:id',
    validateRequest({ params: quizIdParamsSchema }),
    classRoomController.startGame,
  );
  classRoomRouter.get(
    '/results/:roomId',
    validateRequest({ params: roomIdParamsSchema }),
    classRoomController.getResults,
  )

  return classRoomRouter;
};
