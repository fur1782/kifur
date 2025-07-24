import { validateClassRoom } from "../schema/classroom.js";

export class ClassRoomController {
    constructor({classRoomModel}) {
        console.log("ClassRoomController initialized with model:", classRoomModel);
        this.classRoomModel = classRoomModel;
    }

    sendAnswer = async (req, res) => {
        const roomId = req.params.roomId;
        const {qId, answer, user} = req.body

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

        classRoom.puntuationSchema.find(element => element.qId === qId).puntuation += 1

        const result = await this.classRoomModel.updateClassroom({classroomData: {puntuationSchema: classRoom.puntuationSchema}, roomId: roomId})
        req.app.get('io').to(roomId).emit('update-puntuation', {puntuationSchema: classRoom.puntuationSchema})
        res.status(200).json({answer: "correct"})    
    }

    getHello = async (req, res) => {
        res.status(200).json({answer: "correct"})
    }

    updatePuntuation = async (roomId, qId, answer) => {
        //TODO implementar calcul puntuacions
        pass
        
    }

}