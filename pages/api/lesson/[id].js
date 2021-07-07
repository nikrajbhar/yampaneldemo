import Lesson from "../../../models/lesson";
import createHandler from "../../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await fetchLesson(req, res)
});
handler.delete(async (req, res) => {
    await deleteLesson(req, res)
  });

const fetchLesson = async (req, res) => {
    const { id } = req.query
    console.log(req.query);
    const lesson = await Lesson.findOne({ _id: id })
    res.status(200).json(lesson)
}

const deleteLesson = async (req,res)=>{
    console.log('query',req.query);
    const { id } =  req.query   
    await Lesson.findByIdAndDelete({_id:id})
    res.status(200).json({})
  }

export default (req, res) => handler.run(req, res)