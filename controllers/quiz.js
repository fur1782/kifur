import { validateQuest } from "../schema/question.js";
import { validateQuiz } from "../schema/quiz.js";

export class QuizController {
    constructor({quizModel}) {
        console.log("QuizController initialized with model:", quizModel);
        this.quizModel = quizModel;
    }

    getQuestions = async (req, res) => {
        
        console.log("QuizModel instance:", this.quizModel);
        const qId = req.params.id;
        console.log("Fetching questions for quiz ID:", qId);

        const questions = await this.quizModel.getQuestions({id: qId});
        if (questions) return res.json(questions)
        res.status(404).json({error: "Quiz not found or no questions available."});
    }

}