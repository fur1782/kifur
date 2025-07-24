export default function setupClassRoomHandlers(io, socket, classRoomModel) {
    socket.on('join-classroom', ({roomId}) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined classroom ${roomId}`);
    });

    socket.on('start-quiz', async ({roomId}) => {
        console.log("Starting quiz for room:", roomId)
        const classRoom = await classRoomModel.getClassroomById({roomId: roomId})
        console.log("Classroom found:", classRoom)
        if (!classRoom) return

        const questions = await classRoomModel.getQuestions({roomId: roomId})
        io.to(roomId).emit('quiz-started', {questions})
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`)
    });
}