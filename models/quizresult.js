import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const quizresultSchema = new mongoose.Schema({
    studentId: {
        type: ObjectId, // userid
        ref: "users"
    },
    quizId: {
        type: ObjectId, // quiz id
        ref: "quiz"
    },
    examId: {
        type: ObjectId, // exam id
        ref: "exam"
    },
    lessonId: {
        type: ObjectId, // lesson id
        ref: "lesson"
    },
    courseId: {
        type: ObjectId, // course id
        ref: "course"
    },
    answer: {
        type: String
    },
    obtainedMarks: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updateBy: {
        type: String
    },
    updateDate: {
        type: Date
    }
});

export default mongoose.models.quizresult || mongoose.model('quizresult', quizresultSchema);