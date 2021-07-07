import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;


const examSchema = new mongoose.Schema({
    examName: {
        type: String,
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
    duration: {
        type: Number
    },
    image: {
        type: String
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    passingMarks: {
        type: Number,
        default: 0
    },
    noofquestions: {
        type: Number,
        default: 0
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

export default mongoose.models.exam || mongoose.model('exam', examSchema);