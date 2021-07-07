import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
    },
    courseCode: {
        type: String
    },
    categoryId: {
        type: ObjectId, // category id
        ref: "category"
    },
    teacherId: {
        type: ObjectId, // only for teachers
        ref: "users"
    },
    languageId: {
        type: ObjectId, // language id
        ref: "language"
    },
    detail: {
        type: String,
    },
    noOfLessons: {
        type: Number,
        default: 0
    },
    about: {
        type: String
    },
    duration: {
        type: Number // in minutes
    },
    image: {
        type: String
    },
    prerequirments: {
        type: String
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

export default mongoose.models.course || mongoose.model('course', courseSchema);