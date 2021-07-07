import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
    languageName: {
        type: String,
    },
    languageCode: {
        type: String,
    },
    codeSupported: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String
    },
    updatedAt: {
        type: Date
    }
});

export default mongoose.models.language || mongoose.model('language', languageSchema);