import { io } from "socket.io-client";

const SOCKET_URL = process.env.SOCKET_URL ?? "http://localhost:3000";
const SOCKET_TOKEN =
  process.env.SOCKET_ACCESS_TOKEN ?? process.env.KIFUR_SOCKET_TOKEN ?? "canvia-aixo";

const socketOptions = {};
if (SOCKET_TOKEN) {
  socketOptions.auth = { token: SOCKET_TOKEN };
}

const socket = io(SOCKET_URL, socketOptions);

socket.on("connect", () => {
  console.log("Conectado como profesor");
  socket.emit("join-control-room", { roomId: "ABCD"});
  // Simula el start después de un segundo
  setTimeout(() => {
    socket.emit("start-quiz", { roomId: "ABCD" });
  }, 1000);
});

socket.on("update-puntuation", ({puntuationSchema}) => {
  console.log("Preguntas recibidas:", puntuationSchema);
});
