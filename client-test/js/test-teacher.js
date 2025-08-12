import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

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
