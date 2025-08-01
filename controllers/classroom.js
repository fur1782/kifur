import { validateClassRoom } from "../schema/classroom.js";

export class ClassRoomController {
    constructor({ classRoomModel }) {
        console.log("ClassRoomController initialized with model:", classRoomModel);
        this.classRoomModel = classRoomModel;
    }

    sendAnswer = async (req, res) => {
        const roomId = req.params.roomId;
        const { qId, answer } = req.body;

        const classRoom = await this.classRoomModel.getClassroomById({ roomId });

        if (!classRoom) {
            return res.status(400).json({ error: "Classroom not found" });
        }

        const question = classRoom.questions.find(question => question.qId === qId);
        if (!question) {
            return res.status(400).json({ error: "Question not found in classroom" });
        }

        // Comparació directa, sense normalitzar
        const isCorrect = question.answer === answer;

        // Actualiza els contadors y els valors
        await this.updatePuntuation({ classRoom, qId, isCorrect });

        // Guarda el nou estat d'aula
        await this.classRoomModel.updateClassroom({
            classroomData: {
                puntuationSchema: classRoom.puntuationSchema
            },
            roomId
        });

        // Emet esdeveniment als clients connectats
        req.app.get('io').to(roomId).emit('update-puntuation', {
            puntuationSchema: classRoom.puntuationSchema
        });

        return res.status(200).json({ answer: isCorrect ? "correct" : "incorrect" });
    };

    getHello = async (req, res) => {
        res.status(200).json({ answer: "correct" });
    };

    updatePuntuation = async ({ classRoom, qId, isCorrect }) => {
        const alpha = 1; //Aquest paràmetre alfa controla com de forta és la penalització per errors

        const questionPuntuation = classRoom.puntuationSchema.find(p => p.qId === qId);
        if (!questionPuntuation) return;

        if (isCorrect) {
            questionPuntuation.correct = (questionPuntuation.correct || 0) + 1;
        } else {
            questionPuntuation.incorrect = (questionPuntuation.incorrect || 0) + 1;
        }

        const SumQuestionValues = classRoom.puntuationSchema.reduce((acc, p) => {
            return acc + p.value;
        }, 0);

        let tempValues = []; // Valors temporals
        let totalTemp = 0; // Variable per acumular el total dels valors temporals

        for (const p of classRoom.puntuationSchema) {

            const baseValue = p.value ?? 10;
            const correct = p.correct || 0;
            const incorrect = p.incorrect || 0;

            const increasedValue = SumQuestionValues - ((SumQuestionValues - baseValue) / (incorrect + 1));
            const decreasedValue = increasedValue / Math.pow(correct + 1, alpha);

            tempValues.push({ qId: p.qId, temp: decreasedValue }); // Emmagatzema el valor temporal per a cada pregunta
            totalTemp += decreasedValue; // Acumula el total dels valors temporals
        }

        for (const p of classRoom.puntuationSchema) {
            const tempObj = tempValues.find(v => v.qId === p.qId);
            const normalizedValue = (tempObj.temp / totalTemp) * SumQuestionValues; 
            //En aquestes dues últimes línies el que faig és recollir cada objecte temporal (pregunta "qID" i puntuació "value")
            //Llavors ho divideixo pels values totals temporals i ho multiplico per C que és sobre el valor que vull la puntuació al final
            //Algo així com quan fas un examen sobre 8 que treus un 7 i per saber la nota sobre 10 és 7/8*10.
            p.value = Math.round(normalizedValue * 100) / 100;
        }

        return classRoom.puntuationSchema;
    };
}
