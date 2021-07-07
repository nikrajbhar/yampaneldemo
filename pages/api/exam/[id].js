import Exam from "../../../models/exam";
import Lesson from "../../../models/lesson";
import createHandler from "../../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await fetchExam(req, res)
});
handler.delete(async (req, res) => {
    await deleteExam(req, res)
  });

const fetchExam = async (req, res) => {
    const { id } = req.query
    console.log(req.query);
    const exam = await Exam.findOne({ _id: id }).populate('lessonId','lessonName')
    res.status(200).json(exam)
}

const deleteExam = async (req,res)=>{
    console.log('query',req.query);
    const { id } =  req.query   
    await Exam.findByIdAndDelete({_id:id})
    res.status(200).json({})
  }

export default (req, res) => handler.run(req, res)