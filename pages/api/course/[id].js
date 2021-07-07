import Course from "../../../models/course";
import createHandler from "../../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
    await fetchCourse(req, res)
});
handler.delete(async (req, res) => {
    await deleteCourse(req, res)
  });

const fetchCourse = async (req, res) => {
    const { id } = req.query
    console.log(req.query);
    const course = await Course.findOne({ _id: id })
    res.status(200).json(course)
}

const deleteCourse = async (req,res)=>{
    console.log('query',req.query);
    const { id } =  req.query   
    await Course.findByIdAndDelete({_id:id})
    res.status(200).json({})
  }

export default (req, res) => handler.run(req, res)