import Exam from "../../models/exam";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await getExams(req, res)
});

const getExams = async (req, res) => {
    const { lessonId } = req.query;
    Exam.find({ 'lessonId': lessonId }).then(lessons => {
        res.status(200).send(lessons);
    })
}

export default (req, res) => handler.run(req, res);