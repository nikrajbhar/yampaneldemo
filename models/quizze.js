import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
import { questionStatus } from '../components/global';

const quizzeSchema = new mongoose.Schema({
    quizName: {
        type: String,
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
    detail: {
        type: String,
    },
    questionType: {
        type: Number
    },
    answer: {
        type: String
    },
    options:{
        type: String, 
    },
    hints: {
        type: String
    },
    marks: {
        type: Number
    },
    options: {
        type: String // "[{"A"},{"B"},{"C"},{"D"}]" - json string
    },
    isUseHint: {
        type: Boolean
    },
    status: {
        type: Number,
        default: questionStatus.open
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

export default mongoose.models.quiz || mongoose.model('quiz', quizzeSchema);