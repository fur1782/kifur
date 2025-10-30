import mongoose from 'mongoose';
import { createApp } from './index.js';
import { QuizModel } from './models/mongo/quiz.js';
import { ClassroomModel } from './models/mongo/classroom.js';
import { appConfig } from './config/index.js';

async function main() {
  try {
    await mongoose.connect(appConfig.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  }

  createApp({ quizModel: QuizModel, classRoomModel: ClassroomModel, config: appConfig });
}

main();


