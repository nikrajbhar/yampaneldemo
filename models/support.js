import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;
import { supportStatus } from '../components/global';

const supportSchema = new mongoose.Schema({
    query: {
        type: String,
    },
    studentId: {
        type: ObjectId, // student id
        ref: "users"
    },
    status: {
        type: Number,
        default: supportStatus.open
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

export default mongoose.models.support || mongoose.model('support', supportSchema);