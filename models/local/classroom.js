import classrooms from '../../classroom.json' with { type: 'json' };

export class ClassroomModel {
    static async getAll() {
        return classrooms;
    }

    static async getClassroomById({ roomId }) {
        return classrooms.find(classroom => classroom.roomId === roomId);
    }

    static async createClassroom({classroomData}) {
        const newClassroom = {
            status: classroomData.status ?? 'active',
            endedAt: classroomData.endedAt ?? null,
            ...classroomData
        };
        classrooms.push(newClassroom);
        return newClassroom;
    }

    static async updateClassroom({roomId, classroomData}) {
        const index = classrooms.findIndex(classroom => classroom.roomId === roomId);
        if (index === -1) throw new Error("Classroom not found");

        console.log(classroomData)

        classrooms[index] = { ...classrooms[index], ...classroomData };
        return classrooms[index];
    }

    static async addUserToPool({roomId, user}) {
        const index = classrooms.findIndex(classrooms => classrooms.roomId === roomId)
        if (index === -1) throw new Error("Classroom not found");

        classrooms[index].userPool.push(user)
        return classrooms[index]
    }

    static async updateUserPool({roomId, username, valueQuest}){
        const index = classrooms.findIndex(classrooms => classrooms.roomId === roomId)
        if (index === -1) throw new Error("Classroom not found");

        classrooms[index].userPool.find(user => user.username === username).puntuation += valueQuest

        return classrooms[index].userPool
    } 

    static async getQuestions({roomId}) {
        const index = classrooms.findIndex(classroom => classroom.roomId === roomId)
        if (index === -1) throw new Error("Classroom not found");

        return classrooms[index].questions.map(question => {
            return{
                qId: question.qId,
                question: question.question,
                type: question.type,
                options: question.options || [],
                try_limit: question.try_limit || 0
            }
            })
    }

    static async getPuntuations({roomId}) {
        const index = classrooms.findIndex(classrooms => classrooms.roomId === roomId)
        if (index === -1) throw new Error("Classroom not found");

        return classrooms[index].puntuationSchema
    }

    static async finishClassroom({roomId, endedAt}) {
        const index = classrooms.findIndex(classrooms => classrooms.roomId === roomId)
        if (index === -1) throw new Error("Classroom not found");

        classrooms[index] = {
            ...classrooms[index],
            status: 'finished',
            endedAt: endedAt ?? new Date().toISOString()
        };

        return classrooms[index];
    }
}
