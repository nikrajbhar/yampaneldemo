import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const studentcourseSchema = new mongoose.Schema({
    studentId: {
        type: ObjectId, // student id
        ref: "users"
    },
    courseId: {
        type: ObjectId, // course id
        ref: "course"
    },
    percentage: {
        type: Number,
        default: 0
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

export default mongoose.models.studentcourse || mongoose.model('studentcourse', studentcourseSchema);