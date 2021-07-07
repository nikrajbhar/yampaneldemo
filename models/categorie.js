import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
    },
    languageId: {
        type: ObjectId, // language id
        ref: "language"
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

export default mongoose.models.category || mongoose.model('category', categorySchema);