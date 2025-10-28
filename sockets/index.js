import setupClassRoomHandlers from './classroomHandlers.js';
import setupControlRoomHandlers from './controlRoomHandlers.js';

const extractSocketToken = (socket) =>
  socket.handshake.auth?.token ??
  socket.handshake.headers?.['x-socket-token'] ??
  socket.handshake.query?.token;

export default function setupSocket({ io, classRoomModel, config }) {
  io.use((socket, next) => {
    const expectedToken = config?.socket?.accessToken;

    if (!expectedToken) {
      return next();
    }

    const providedToken = extractSocketToken(socket);

    if (providedToken === expectedToken) {
      return next();
    }

    return next(new Error('Unauthorized socket connection'));
  });

  io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);

    setupClassRoomHandlers(io, socket, classRoomModel);
    setupControlRoomHandlers(io, socket);
  });
}
