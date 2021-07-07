import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const lessonSchema = new mongoose.Schema({
    lessonName: {
        type: String,
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
    typeid: {
        type: Number
    },
    image: {
        type: String
    },
    lessonDetails: {
        type: String
    },
    lessonVideo: {
        type: String // video url
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

export default mongoose.models.lesson || mongoose.model('lesson', lessonSchema);