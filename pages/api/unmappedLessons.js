import Exam from "../../models/exam";
import Lesson from "../../models/lesson";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await getunmappedLessons(req, res)
});

//in progress................
const getunmappedLessons = async (req, res) => {
    let exams = await Exam.find()
    let exammap = exams.map(exam => exam.lessonId._id)
    let lessons = await Lesson.find({ _id : {$nin: exammap } })
    console.log('result',lessons);
    res.status(201).json({lessons})
}


export default (req, res) => handler.run(req, res);