import Exam from "../../models/exam";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await getExam(req, res)
});

const getExam = async (req, res) => {
    const { Id } = req.query;
    Exam.findOne({ _id: Id }).then(exams => {
        res.status(200).send(exams);
    })
}

export default (req, res) => handler.run(req, res);