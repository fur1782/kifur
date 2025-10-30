import {z} from 'zod';
import { QuestSchema } from './question.js';

const QuizSchema = z.object({
    id: z.string().min(1, { message: 'Quiz id is required' }).optional(),
    questions: z.array(QuestSchema),
    title: z.string().optional(),
    description: z.string().optional(),
    author: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
})

export function validateQuiz(data) {
    const result = QuizSchema.safeParse(data);
    if (!result.success) {
        throw new Error(`Validation failed: ${result.error}`);
    }
    return result.data;
}
