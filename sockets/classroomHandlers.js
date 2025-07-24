export default function setupClassRoomHandlers(io, socket, classRoomModel) {
    socket.on('join-classroom', ({roomId}) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined classroom ${roomId}`);
    });

    socket.on('start-quiz', async ({roomId}) => {
        const classRoom = await classRoomModel.getClassroomById({roomId: roomId})
        if (!classRoom) return

        const questions = await classRoomModel.getQuestions({roomId: roomId})
        io.to(roomId).emit('quiz_started', {questions})
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`)
    });
}