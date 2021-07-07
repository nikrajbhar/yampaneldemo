import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const studentexamSchema = new mongoose.Schema({
    studentId: {
        type: ObjectId, // student id
        ref: "users"
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
    percentage: {
        type: Number,
        default: 0
    },
    obtainedMarks: {
        type: Number,
        default: 0
    },
    chatJSON: {
        type: String // chatObject as a string
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.studentexam || mongoose.model('studentexam', studentexamSchema)




