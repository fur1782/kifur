export class QuizController {
    constructor({quizModel}) {
        console.log("QuizController initialized with model:", quizModel);
        this.quizModel = quizModel;
    }

    getQuestions = async (req, res) => {
        const qId = req.params.id;

        const questions = await this.quizModel.getQuestions({id: qId});
        if (questions) return res.json(questions)
        res.status(404).json({error: "Quiz not found or no questions available."});
    }

    getQuizList = async (req, res) => {
        const quizzes = await this.quizModel.getAll();
        if (quizzes) return res.json(quizzes);
        res.status(404).json({error: "No quizzes found."});
    }

}
