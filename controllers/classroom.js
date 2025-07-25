import { validateClassRoom } from "../schema/classroom.js";

export class ClassRoomController {
    constructor({classRoomModel, quizModel}) {
        console.log("ClassRoomController initialized with model:", classRoomModel);
        this.classRoomModel = classRoomModel;
        this.quizModel = quizModel;
    }

    sendAnswer = async (req, res) => {
        const roomId = req.params.roomId;
        const {qId, answer, userName} = req.body

        const classRoom = await this.classRoomModel.getClassroomById({roomId: roomId})

        if (!classRoom) {
            return res.status(400).json({error: "Classroom not found"});
        }

        const question = classRoom.questions.find(question => question.qId === qId)

        if (!question) {
            return res.status(400).json({error: "Question Classroom not found"});
        }

        if( question.answer !== answer ){
            return res.status(200).json({answer: "incorrect"})
        }

        classRoom.userPool.find(user => user.userName === userName).puntuation += classRoom.puntuationSchema.find(element => element.qId === qId).puntuation
        classRoom.puntuationSchema.find(element => element.qId === qId).puntuation += 1
        
        const result = await this.classRoomModel.updateClassroom({classroomData: {puntuationSchema: classRoom.puntuationSchema}, roomId: roomId})
        req.app.get('io').to(roomId).emit('update-puntuation', {puntuationSchema: classRoom.puntuationSchema, userPool: classRoom.userPool})
        res.status(200).json({answer: "correct"})    
    }

    updatePuntuation = async (roomId, qId, answer) => {
        //TODO implementar calcul puntuacions
        pass
        
    }

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
            puntuationSchema: quiz.questions.map(question => ({qId: question.qId, puntuation: 1}))
        }

        console.log(classroomData)

        const result = validateClassRoom(classroomData)

        if(result.error) {
            return res.status(400).json({error: classroomData.error})
        }

        await this.classRoomModel.createClassroom({classroomData: classroomData})
        res.status(200).json({roomId: classroomData.roomId})
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