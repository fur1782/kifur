import quizzes from "../../quiz.json" with { type: "json" };
import { validateQuiz } from "../../schema/quiz.js";

export class QuizModel {

    static async getAll() {
        return quizzes;
    }

    static async getQuizById({id}) {
        return quizzes.find(quiz => quiz.id === id)
    }

    static async createQuiz(quizData) {
        const validatedQuiz = validateQuiz(quizData)
        quizzes.push(validatedQuiz)
        return validatedQuiz
    }

    static async updateQuiz(id, quizData) {
        const index = quizzes.findIndex(quiz => quiz.id === id)
        if (index === -1) throw new Error("Quiz not found")  
        
        const validatedQuiz = validateQuiz(quizData)
        quizzes[index] = { ...quizzes[index], ...validatedQuiz }
        return quizzes[index]
    }

    static async getQuestions({id}) {
        const quiz = quizzes.find(quiz => quiz.id === id)
        console.log("Quiz found:", quiz)
        if (!quiz) throw new Error("Quiz not found");
        return quiz.questions.map(question => {
            return{
                question: question.question,
                type: question.type,
                options: question.options || [],
                try_limit: question.try_limit || 0
            }
            })
    }
}
