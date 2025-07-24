import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Conectado como alumno");
  socket.emit("join-classroom", { roomId: "ABCD"});
});

socket.on("quiz-started", (data) => {
  console.log("Preguntas recibidas:", data.questions);
});
