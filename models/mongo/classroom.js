import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Subdocumento para preguntas
const QuestionSchema = new Schema(
  {
    qId: { type: Number, required: true },
    question: { type: String, required: true },
    type: {
      type: String,
      enum: ['multiple-answer', 'text', 'boolean'],
      required: true,
    },
    answer: { type: String, required: true },
    options: { type: [String], default: undefined },
    try_limit: { type: Number, default: undefined },
  },
  { _id: false }
);

// Subdocumento para usuarios en el pool
const UserPoolSchema = new Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    puntuation: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

// Subdocumento para esquema de puntuación
const PuntuationSchema = new Schema(
  {
    qId: { type: Number, required: true },
    puntuation: { type: Number, required: true, default: 1 },
    value: { type: Number, required: true, default: 10 },
    correct: { type: Number, required: true, default: 0 },
    incorrect: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ClassroomSchema = new Schema(
  {
    roomId: { type: String, required: true, unique: true, index: true },
    userPool: { type: [UserPoolSchema], required: true, default: [] },
    questions: { type: [QuestionSchema], required: true, default: [] },
    puntuationSchema: { type: [PuntuationSchema], required: true, default: [] },
    status: {
      type: String,
      enum: ['active', 'finished'],
      required: true,
      default: 'active',
    },
    endedAt: { type: Date, default: null },
  },
  { 
    timestamps: true,
    collection: 'classroom',
  }
);

const Classroom = model('Classroom', ClassroomSchema);

export class ClassroomModel {
  static async getAll() {
    return Classroom.find({});
  }

  static async getClassroomById({ roomId }) {
    return Classroom.findOne({ roomId }).lean().exec();
  }

  static async createClassroom({ classroomData }) {
    const created = await Classroom.create(classroomData);
    return created.toObject();
  }

  static async updateClassroom({ roomId, classroomData }) {
    const updated = await Classroom.findOneAndUpdate(
      { roomId },
      { $set: classroomData },
      { new: true, lean: true }
    ).exec();
    if (!updated) throw new Error('Classroom not found');
    return updated;
  }

  static async addUserToPool({ roomId, user }) {
    const updated = await Classroom.findOneAndUpdate(
      { roomId },
      { $push: { userPool: user } },
      { new: true, lean: true }
    ).exec();
    if (!updated) throw new Error('Classroom not found');
    return updated;
  }

  static async updateUserPool({ roomId, username, valueQuest }) {
    const updated = await Classroom.findOneAndUpdate(
      { roomId, 'userPool.username': username },
      { $inc: { 'userPool.$.puntuation': valueQuest } },
      { new: true, lean: true }
    ).exec();
    if (!updated) throw new Error('Classroom not found or user not found');

    console.log("updated element",updated)

    return updated.userPool;
  }

  static async getQuestions({ roomId }) {
    const classroom = await Classroom.findOne({ roomId }).lean().exec();
    if (!classroom) throw new Error('Classroom not found');
    return classroom.questions.map((question) => ({
      qId: question.qId,
      question: question.question,
      type: question.type,
      options: question.options ?? [],
      try_limit: question.try_limit ?? 0,
    }));
  }

  static async getPuntuations({ roomId }) {
    const classroom = await Classroom.findOne({ roomId })
      .select({ puntuationSchema: 1, _id: 0 })
      .lean()
      .exec();
    if (!classroom) throw new Error('Classroom not found');
    return classroom.puntuationSchema;
  }

  static async finishClassroom({ roomId, endedAt }) {
    const resolvedEndedAt = endedAt ? new Date(endedAt) : new Date();
    const updated = await Classroom.findOneAndUpdate(
      { roomId },
      { $set: { status: 'finished', endedAt: resolvedEndedAt } },
      { new: true, lean: true }
    ).exec();
    if (!updated) throw new Error('Classroom not found');
    return updated;
  }
}


