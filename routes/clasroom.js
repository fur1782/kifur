import { Router } from "express";
import { ClassRoomController } from "../controllers/classroom.js";

export const createClassRoomRouter = ({classRoomModel, quizModel}) => {
    const classRoomRouter = Router();

    const classRoomController = new ClassRoomController({classRoomModel, quizModel});

    // quizRouter.post("/init",));
    // quizRouter.post("/answer", );
    // No sé si utilitzar REST API per aquesta funcionalitat, jo crec que podem fer-ho directament amb WS
    // quizRouter.get("/join/:id", );
    classRoomRouter.post("/:roomId/answer", classRoomController.sendAnswer);
    classRoomRouter.get("/all", classRoomController.getClassrooms);
    classRoomRouter.get("/start/:id", classRoomController.startGame);

    return classRoomRouter;

}


