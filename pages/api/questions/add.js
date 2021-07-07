import Quizze from "../../../models/quizze";
import Exam from "../../../models/exam";
import createHandler from "../../../mongoose/createHandler";
const handler = createHandler();

handler.post(async (req, res) => {
    await saveQuestions(req, res);
});


const saveQuestions = async (req, res) => {
    let questionArray = [...req.body];
    Quizze.insertMany(questionArray, async function (err, docs) {
        if (err) res.status(200).send({ success: false });

        let exam = await Exam.findById(req.query.examId).exec();
        if (exam) {
            let totalMarks = exam.totalMarks ? exam.totalMarks : 0;
            let passingMarks = exam.passingMarks ? exam.passingMarks : 0;
            let noofquestions = exam.noofquestions ? exam.noofquestions : 0;

            let newTotalMarks = questionArray.reduce((accumulator, current) => accumulator + current.marks, totalMarks);
            let newPassingMarks = passingMarks + Math.round(newTotalMarks * 35 / 100);
            let newNoofquestions = noofquestions + questionArray.length;
            Exam.findByIdAndUpdate(req.query.examId, { 'totalMarks': newTotalMarks, 'passingMarks': newPassingMarks, 'noofquestions': newNoofquestions }, { new: false }).exec();
        }
        res.status(201).send({ success: true, data: docs });
    });
}

export default (req, res) => handler.run(req, res);