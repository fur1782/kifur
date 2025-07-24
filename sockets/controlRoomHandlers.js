export default function setupControlRoomHandlers(io, socket) {
    socket.on('join-control-room', ({roomId}) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined control room ${roomId}`);
    })

    socket.on('send-question-pack', ({roomId, questions}) => {
        io.to(roomId).emit('question-pack', {questions})
    })
}