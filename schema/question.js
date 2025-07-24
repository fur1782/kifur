import {z} from 'zod';

const type = z.enum([ 'multiple-answer', 'text', 'boolean']);

const QuestSchema = z.object({
    qId: z.int(),
    question: z.string(),
    type: z.enum(type),
    answer: z.string(),
    options: z.array(z.string()).optional(),
    try_limit: z.number().optional()
})

function validateQuest(data) {
    const result = QuestSchema.safeParse(data);
    if (!result.success) {
        throw new Error(`Validation failed: ${result.error}`);
    }
    return result.data;
}

export { QuestSchema, validateQuest };