import { validateClassRoom } from "../schema/classroom.js";

export class ClassRoomController {
    constructor({ classRoomModel }) {
        console.log("ClassRoomController initialized with model:", classRoomModel);
        this.classRoomModel = classRoomModel;
    }

    sendAnswer = async (req, res) => {
        const roomId = req.params.roomId;
        const { qId, answer, user } = req.body;

        const classRoom = await this.classRoomModel.getClassroomById({ roomId });

        if (!classRoom) {
            return res.status(400).json({ error: "Classroom not found" });
        }

        const question = classRoom.questions.find(question => question.qId === qId);
        if (!question) {
            return res.status(400).json({ error: "Question not found in classroom" });
        }

        // Valor actual de la pregunta ABANS d'actualitzar la puntuació
        const questionPuntuation = classRoom.puntuationSchema.find(p => p.qId === qId);
        if (!questionPuntuation) {
            return res.status(400).json({ error: "Puntuation not found for question" });
        }
        const currentValue = questionPuntuation.value ?? 10;

        // Normalització de respostes de tipus text (opcional)
        let isCorrect;
        if (question.type === "text") {
            const normalize = str =>
                str
                    .trim()
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, " ");
            isCorrect = normalize(question.answer) === normalize(answer);
        } else {
            isCorrect = question.answer === answer;
        }

        // Si usuario no té un score, inicialitzem
        if (!classRoom.scores) {
            classRoom.scores = {};
        }
        if (!classRoom.scores[user]) {
            classRoom.scores[user] = 0;
        }

        // Si respon correctament, sumem el value actual al score
        if (isCorrect) {
            classRoom.scores[user] += currentValue;
            // Opcional: arrodonir a 2 decimals
            classRoom.scores[user] = Math.round(classRoom.scores[user] * 100) / 100;
        }

        // Actualiza els comptadors i els valors (correct / incorrect i recalcula valors)
        await this.updatePuntuation({ classRoom, qId, isCorrect });

        // Guarda el nou estat de l'aula (amb les puntuationSchema i les scores)
        const result = await this.classRoomModel.updateClassroom({
            classroomData: {
                puntuationSchema: classRoom.puntuationSchema,
                scores: classRoom.scores
            },
            roomId
        });

        // Emet esdeveniment als clients connectats (puntuationSchema y scores)
        req.app.get('io').to(roomId).emit('update-puntuation', {
            puntuationSchema: classRoom.puntuationSchema,
            scores: classRoom.scores
        });

        return res.status(200).json({ answer: isCorrect ? "correct" : "incorrect" });
    };

    getHello = async (req, res) => {
        res.status(200).json({ answer: "correct" });
    };

    updatePuntuation = async ({ classRoom, qId, isCorrect }) => {
        const alpha = 1; // control del decreixement per encerts

        const questionPuntuation = classRoom.puntuationSchema.find(p => p.qId === qId);
        if (!questionPuntuation) return;

        if (isCorrect) {
            questionPuntuation.correct = (questionPuntuation.correct || 0) + 1;
        } else {
            questionPuntuation.incorrect = (questionPuntuation.incorrect || 0) + 1;
        }

        // Suma de valors base inicials
        const C = classRoom.puntuationSchema.reduce((acc, p) => {
            const question = classRoom.questions.find(q => q.qId === p.qId);
            const baseValue = question?.value ?? 10;
            return acc + baseValue;
        }, 0);

        // Recalcular els valors
        classRoom.puntuationSchema.forEach(p => {
            const question = classRoom.questions.find(q => q.qId === p.qId);
            if (!question) return;

            const baseValue = question.value ?? 10;
            const correct = p.correct || 0;
            const incorrect = p.incorrect || 0;

            const increasedValue = C - ((C - baseValue) / (incorrect + 1));
            const decreasedValue = increasedValue / Math.pow(correct + 1, alpha);

            p.value = Math.round(decreasedValue * 100) / 100;
        });

        return classRoom.puntuationSchema;
    };
}

