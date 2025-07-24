import setupClassRoomHandlers from "./classroomHandlers.js";
import setupControlRoomHandlers from "./controlRoomHandlers.js";

export default function setupSocket({io, quizModel, classRoomModel}) {
    io.on('connection', (socket) => {
        console.log(`Socket ${socket.id} connected`);

        setupClassRoomHandlers(io, socket, classRoomModel);
        setupControlRoomHandlers(io, socket);
    })
}