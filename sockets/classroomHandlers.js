export default function setupClassRoomHandlers(io, socket, classRoomModel) {
    socket.on('join-classroom', async ({roomId, userName}) => {
        socket.join(roomId);
        const classRoom = await classRoomModel.addUserToPool({roomId: roomId, user:{userId: socket.id, userName: userName, puntuation: 0}})
        io.to(roomId).emit('user-joined', {userPool: classRoom.userPool})
        console.log(`Socket ${socket.id} joined classroom ${roomId}`);
    });

    socket.on('start-quiz', async ({roomId}) => {
        console.log("Starting quiz for room:", roomId)
        const classRoom = await classRoomModel.getClassroomById({roomId: roomId})
        console.log("Classroom found:", classRoom)
        if (!classRoom) return

        //des del controladro, es pot accedir a altres models sense problemes. 
        //TODO: fer-ho amb el quizModel
        const questions = await classRoomModel.getQuestions({roomId: roomId})
        io.to(roomId).emit('update-puntuation', { puntuationSchema: classRoom.puntuationSchema})
        io.to(roomId).emit('quiz-started', {questions})
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`)
    });
}