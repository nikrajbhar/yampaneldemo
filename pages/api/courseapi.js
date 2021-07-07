import Course from "../../models/course";
import user from "../../models/user";
import categorie from "../../models/categorie";
import language from "../../models/language";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getCourse(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postCourse(req, res)
});
handler.put(async (req, res) => {
  await updateCourse(req, res)
});

// .populate("languageId").populate("teacherId").populate("categoryId")
// populate({ path: 'conversation', model: Conversation });
const getCourse = async (req, res) => {
    Course.find().populate("teacherId","firstName").populate("categoryId").populate("languageId").then(course => { 
    res.status(200).json({ course })
  })
}

const postCourse = async (req, res) => {
  const {isActive, courseCode, courseName, categoryId, detail,teacherId,duration,prerequirments,createdBy,image,languageId } = req.body
  console.log(req.body);
  const course = await new Course({     
    isActive,
    courseName,
    courseCode,
    categoryId,
    detail,
    teacherId,
    duration,
    prerequirments,
    createdBy,
    image,
    languageId,
  }).save()
  res.status(201).json(course)
}


const updateCourse = async (req, res) => {
  console.log("req.body put course api", req.body);
  const { _id, isActive,courseName,courseCode,categoryId,detail,teacherId,duration,prerequirments,image, languageId, updateBy, updateDate } = req.body
  const courseop = await Course.findOneAndUpdate(
    { _id: _id },
    { $set: { isActive: isActive,courseName:courseName,courseCode:courseCode,categoryId:categoryId,detail:detail,teacherId:teacherId,duration:duration,prerequirments:prerequirments,image:image, languageId:languageId, updateBy:updateBy , updateDate:updateDate } }
  )
  res.status(201).json(courseop)
}

export default (req, res) => handler.run(req, res)

// const deleteCategory = async (req,res)=>{
//   const {pid } =  req.query
 
//   await Categorie.findByIdAndDelete({_id:pid})
//   res.status(200).json({})
// }