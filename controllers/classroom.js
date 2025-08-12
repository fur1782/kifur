import { validateClassRoom } from "../schema/classroom.js";

export class ClassRoomController {
    constructor({classRoomModel, quizModel}) {
        console.log("ClassRoomController initialized with model:", classRoomModel);
        this.classRoomModel = classRoomModel;
        this.quizModel = quizModel;
    }

    sendAnswer = async (req, res) => {
        const roomId = req.params.roomId;
        const {qId, answer, userName, trys} = req.body

        const classRoom = await this.classRoomModel.getClassroomById({roomId: roomId})

        if (!classRoom) {
            return res.status(400).json({error: "Classroom not found"});
        }

        const question = classRoom.questions.find(question => question.qId === qId)

        if (!question) {
            return res.status(400).json({error: "Question Classroom not found"});
        }

        // Comparació directa, sense normalitzar
        const isCorrect = question.answer === answer;

        if (isCorrect){
            const valueQuest = classRoom.puntuationSchema.find(element => element.qId === qId).value
            console.log(valueQuest)
            classRoom.userPool = await this.classRoomModel.updateUserPool({roomId, username:userName, valueQuest})
        }

        // Actualiza els contadors y els valors
        const updatedPuntuation = await this.updatePuntuation({ classRoom, qId, isCorrect });

        

        // Guarda el nou estat d'aula
        await this.classRoomModel.updateClassroom({classroomData: { puntuationSchema: classRoom.puntuationSchema}, roomId});

        // Emet esdeveniment als clients connectats
        req.app.get('io').to(roomId).emit('update-puntuation', {
            puntuationSchema: classRoom.puntuationSchema,
            userPool: classRoom.userPool
        });

        return res.status(200).json({ answer: isCorrect ? "correct" : "incorrect" });
        
        /*if( question.answer !== answer ){
            return res.status(200).json({answer: "incorrect"})
        }

        classRoom.userPool.find(user => user.userName === userName).puntuation += classRoom.puntuationSchema.find(element => element.qId === qId).puntuation
        classRoom.puntuationSchema.find(element => element.qId === qId).puntuation += 1
        
        const result = await this.classRoomModel.updateClassroom({classroomData: {puntuationSchema: classRoom.puntuationSchema}, roomId: roomId})
        req.app.get('io').to(roomId).emit('update-puntuation', {puntuationSchema: classRoom.puntuationSchema, userPool: classRoom.userPool})
        res.status(200).json({answer: "correct"})*/    
    }

    updatePuntuation = async ({ classRoom, qId, isCorrect }) => {
        const alpha = 1; //Aquest paràmetre alfa controla com de forta és la penalització per errors

        const questionPuntuation = classRoom.puntuationSchema.find(p => p.qId === qId);
        if (!questionPuntuation) return;

        isCorrect ? questionPuntuation.correct++ : questionPuntuation.incorrect++;

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

    startGame = async (req, res) => {
        const {id} = req.params

        const quiz = await this.quizModel.getQuizById({id: id})

        if (!quiz) {
            return res.status(400).json({error: "Quiz not found"});
        }

        const classroomData = {
            roomId: this.generateRoomCode(),
            questions: quiz.questions,
            userPool: [],
            puntuationSchema: quiz.questions.map(question => ({qId: question.qId, puntuation: 1, value: 10, correct: 0, incorrect: 0}))
        }

        console.log(classroomData)

        const result = validateClassRoom(classroomData)

        if(result.error) {
            return res.status(400).json({error: classroomData.error})
        }

        const newClassroom = await this.classRoomModel.createClassroom({classroomData: classroomData})
        res.status(200).json({roomId: newClassroom.roomId})
    }

    generateRoomCode( length = 5){
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        let code = ""
        for (let i = 0; i < length; i++) {
            code += chars[Math.floor(Math.random() * chars.length)]
        }
        return code
    }

    getClassrooms = async (req, res) => {
        const classrooms = await this.classRoomModel.getAll()
        res.status(200).json(classrooms)
    }


}
