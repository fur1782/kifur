import { Router } from "express";
import { ClassRoomController } from "../controllers/classroom.js";

export const createClassRoomRouter = ({classRoomModel}) => {
    const classRoomRouter = Router();

    const classRoomController = new ClassRoomController({classRoomModel});

    // quizRouter.post("/init",));
    // quizRouter.post("/answer", );
    // No sé si utilitzar REST API per aquesta funcionalitat, jo crec que podem fer-ho directament amb WS
    // quizRouter.get("/join/:id", );
    classRoomRouter.post("/:roomId/answer", classRoomController.sendAnswer);
    classRoomRouter.get("/testingEntry", classRoomController.getHello);

    return classRoomRouter;

}


