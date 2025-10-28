export default function setupControlRoomHandlers(io, socket) {
  socket.on('join-control-room', (payload) => {
    const roomId = typeof payload?.roomId === 'string' ? payload.roomId.trim() : '';

    if (!roomId) {
      socket.emit('error', { message: 'roomId is required to join control room' });
      return;
    }

    socket.join(roomId);
    console.log(`Socket ${socket.id} joined control room ${roomId}`);
  });

  socket.on('send-question-pack', (payload) => {
    const roomId = typeof payload?.roomId === 'string' ? payload.roomId.trim() : '';
    const questions = Array.isArray(payload?.questions) ? payload.questions : null;

    if (!roomId || !questions) {
      socket.emit('error', { message: 'Invalid payload for send-question-pack' });
      return;
    }

    io.to(roomId).emit('question-pack', { questions });
  });
}
