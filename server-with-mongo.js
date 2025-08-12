import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './index.js';
import { QuizModel } from './models/mongo/quiz.js';
import { ClassroomModel } from './models/mongo/classroom.js';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/kifur';

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  }

  createApp({ quizModel: QuizModel, classRoomModel: ClassroomModel });
}

main();


