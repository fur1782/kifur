export default function setupClassRoomHandlers(io, socket, classRoomModel) {
  socket.on('join-classroom', async (payload) => {
    const roomId = typeof payload?.roomId === 'string' ? payload.roomId.trim() : '';
    const userName = typeof payload?.userName === 'string' ? payload.userName.trim() : '';

    if (!roomId || !userName) {
      socket.emit('error', { message: 'Invalid join payload' });
      return;
    }

    try {
      socket.join(roomId);
      const classRoom = await classRoomModel.addUserToPool({
        roomId,
        user: { userId: socket.id, username: userName, puntuation: 0 },
      });
      io.to(roomId).emit('user-joined', { userPool: classRoom.userPool });
      console.log(`Socket ${socket.id} joined classroom ${roomId}`);
    } catch (error) {
      console.error(`Error joining classroom ${roomId}:`, error);
      socket.emit('error', { message: 'Unable to join classroom' });
    }
  });

  socket.on('start-quiz', async (payload) => {
    const roomId = typeof payload?.roomId === 'string' ? payload.roomId.trim() : '';

    if (!roomId) {
      socket.emit('error', { message: 'roomId is required to start quiz' });
      return;
    }

    try {
      console.log('Starting quiz for room:', roomId);
      const classRoom = await classRoomModel.getClassroomById({ roomId });
      if (!classRoom) {
        socket.emit('error', { message: 'Classroom not found' });
        return;
      }

      const questions = await classRoomModel.getQuestions({ roomId });
      io.to(roomId).emit('update-puntuation', { puntuationSchema: classRoom.puntuationSchema });
      io.to(roomId).emit('quiz-started', { questions });
    } catch (error) {
      console.error(`Error starting quiz for room ${roomId}:`, error);
      socket.emit('error', { message: 'Unable to start quiz' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
}
