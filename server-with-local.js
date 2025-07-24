import { createApp } from "./index.js";
import { QuizModel } from "./models/local/quiz.js";
import { ClassroomModel } from "./models/local/classroom.js"; 

createApp({ quizModel: QuizModel,  classRoomModel: ClassroomModel})