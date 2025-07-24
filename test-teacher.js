import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Conectado como profesor");
  socket.emit("join_classroom", { roomId: "ABCD", user: "profesor" });
  // Simula el start después de un segundo
  setTimeout(() => {
    socket.emit("start_quiz", { roomId: "ABCD" });
  }, 1000);
});
