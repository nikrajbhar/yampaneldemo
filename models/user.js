import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    userType: {
        type: Number
    },
    loginType: {
        type: Number
    },
    socialLoginId: {
        type: String
    },
    mobileNo: {
        type: String
    },
    dob: {
        type: Date,
    },
    address: {
        type: String
    },
    timezone: {
        type: Number
    },
    profileImage: {
        type: String
    },
    gender: {
        type: Number
    },
    fbToken: {
        type: String,
        default: null
    },
    isEmailverified: {
        type: Boolean,
        default: false
    },
    emailVerificationdate: {
        type: Date
    },
    otp: {
        type: String
    },
    otpDate: {
        type: Date,
        default: Date.now
    },
    rollno: {
        type: String,
    },
    studentclass: {
        type: String,
    },
    parentsName: {
        type: String,
    },
    parentsnumber: {
        type: String,
    },
    bloodgroup: {
        type: String,
    },
    designation: {
        type: String,
    },
    education: {
        type: String,
    },
    department: {
        type: String,
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
    },
});

export default mongoose.models.users || mongoose.model('users', userSchema);