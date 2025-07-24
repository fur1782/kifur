import {z} from 'zod';
import { QuestSchema } from './question.js';

const ClassroomSchema = z.object({
    roomId: z.string(),
    userPool: z.array(z.string()),
    questions: z.array(QuestSchema),
    puntuationSchema: z.array(z.object({
        qId: z.int(), 
        puntuation: z.int()
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