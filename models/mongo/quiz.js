import mongoose from 'mongoose';
import { validateQuiz } from '../../schema/quiz.js';

const { Schema, model } = mongoose;

const QuestionSchema = new Schema(
  {
    qId: { type: Number, required: true },
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ['multiple-answer', 'text', 'boolean'],
      required: true,
    },
    answer: { type: String, required: true },
    options: { type: [String], default: undefined },
    try_limit: { type: Number, default: undefined },
  },
  { _id: false }
);

const QuizSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    questions: { type: [QuestionSchema], required: true, default: [] },
    title: { type: String },
    description: { type: String },
    author: { type: String },
  },
  { 
    timestamps: true,
    collection: 'quiz' // Especificar el nombre exacto de la colección
  }
);

const Quiz = model('Quiz', QuizSchema);

export class QuizModel {
  static async getAll() {
    return Quiz.find({}).lean().exec();
  }

  static async getQuizById({ id }) {
    return Quiz.findOne({ id }).lean().exec();
  }

  static async createQuiz(quizData) {
    const validatedQuiz = validateQuiz(quizData);
    const created = await Quiz.create(validatedQuiz);
    return created.toObject();
  }

  static async updateQuiz(id, quizData) {
    const validatedQuiz = validateQuiz(quizData);
    const updated = await Quiz.findOneAndUpdate(
      { id },
      { $set: validatedQuiz },
      { new: true, lean: true }
    ).exec();
    if (!updated) throw new Error('Quiz not found');
    return updated;
  }

  static async getQuestions({ id }) {
    const quiz = await Quiz.findOne({ id }).lean().exec();
    if (!quiz) throw new Error('Quiz not found');
    return quiz.questions.map((question) => ({
      question: question.question,
      type: question.type,
      options: question.options ?? [],
      try_limit: question.try_limit ?? 0,
    }));
  }
}


