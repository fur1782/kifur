import {z} from 'zod';
import { QuestSchema } from './question.js';

const ClassroomSchema = z.object({
    roomId: z.string(),
    userPool: z.array(z.object({
        userId: z.string(),
        username: z.string(),
        puntuation: z.int(),
    })),
    questions: z.array(QuestSchema),
    puntuationSchema: z.array(z.object({
        qId: z.int(), 
        puntuation: z.int(),
        value: z.int(),
        correct: z.int(),
        incorrect: z.int(),
    }))
})

function validateClassRoom(data) {
    const result = ClassroomSchema.safeParse(data);
    if (!result.success) {
        throw new Error(`Validation failed: ${result.error}`);
    }
    return result.data;
}

export { ClassroomSchema, validateClassRoom };