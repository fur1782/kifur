import { Router } from "express";
import { QuizController } from "../controllers/quiz.js";

export const createQuizRouter = ({quizModel}) => {
    const quizRouter = Router();

    const quizController = new QuizController({quizModel});

    // quizRouter.post("/init",));
    // quizRouter.post("/answer", );
    // No sé si utilitzar REST API per aquesta funcionalitat, jo crec que podem fer-ho directament amb WS
    // quizRouter.get("/join/:id", );
    quizRouter.get("/:id/questions", quizController.getQuestions);
    quizRouter.get("/list", quizController.getQuizList);

    return quizRouter;

}


