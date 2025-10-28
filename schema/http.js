import { z } from 'zod';

export const roomIdParamsSchema = z.object({
  roomId: z
    .string()
    .min(1, { message: 'roomId is required' })
    .max(32, { message: 'roomId too long' }),
});

export const quizIdParamsSchema = z.object({
  id: z
    .string()
    .min(1, { message: 'Quiz id is required' })
    .max(64, { message: 'Quiz id too long' }),
});

export const sendAnswerBodySchema = z.object({
  qId: z.number({ required_error: 'qId is required' }),
  answer: z.string().min(1, { message: 'answer is required' }),
  userName: z.string().min(1, { message: 'userName is required' }),
  trys: z.number().int().min(0).optional(),
});
