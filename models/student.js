import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
   
    firstname: {
        type: String,
    },

    lastname: {
        type: String,
    },

    email: {
        type: String,      
    },
    registrationDate: {
        type: String,
    },   
    rollno: {
        type: String,
    },
    class:{
        type: String,
    },
    gender: {
        type: String,
    },
    mobileNumber: {
        type: Number,
    },
    parentsName: {
        type: String,
    },
    parentsnumber: {
        type: String,
    },
   
    birthdate: {
        type: String,
    }, 
    bloodgroup: {
        type: String,
    },
    address: {
        type: String,
    },
    image: {
        type: String,
    },   

    createdDate: {
        type: Date,
        default: Date.now
    },

},
)

export default mongoose.models.student || mongoose.model('student', studentSchema)




