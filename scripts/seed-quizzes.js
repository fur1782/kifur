import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mongoose from 'mongoose';

import { appConfig } from '../config/index.js';
import { QuizModel } from '../models/mongo/quiz.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedFilePath = path.resolve(__dirname, '../data/quizzes.seed.json');

async function seedQuizzes() {
  try {
    const raw = await readFile(seedFilePath, 'utf8');
    const quizzes = JSON.parse(raw);

    if (!Array.isArray(quizzes)) {
      throw new Error('Seed file does not contain an array of quizzes');
    }

    let created = 0;
    let updated = 0;

    for (const quiz of quizzes) {
      if (!quiz?.id) {
        console.warn('Skipping quiz without id:', quiz);
        continue;
      }

      const existing = await QuizModel.getQuizById({ id: quiz.id });

      if (existing) {
        await QuizModel.updateQuiz(quiz.id, quiz);
        updated += 1;
      } else {
        await QuizModel.createQuiz(quiz);
        created += 1;
      }
    }

    console.log(`Seed completed. Created: ${created}, Updated: ${updated}`);
  } catch (error) {
    console.error('Error seeding quizzes:', error);
    process.exitCode = 1;
  }
}

async function main() {
  try {
    await mongoose.connect(appConfig.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB');

    await seedQuizzes();
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
