import Lesson from "../../models/lesson";
import Course from "../../models/course";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();


handler.get(async (req, res) => {
  console.log("get called");
  await getCourse(req, res)
});


const getCourse = async (req, res) => {  
  console.log("get called....");
  Course.find({}).countDocuments().then(course => {
    res.status(200).json({ course })
  })
}

export default (req, res) => handler.run(req, res)







