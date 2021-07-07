import Studentcourse from "../../models/studentcourse";
import Course from "../../models/course";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getStudentcourse(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postStudentcourse(req, res)
});
handler.put(async (req, res) => {
  await updateStudentcourse(req, res)
});
// handler.delete(async (req, res) => {
//   await deleteCategory(req, res)
// });




const getStudentcourse = async (req, res) => {

  const studentCourses = await Course.aggregate([
    {
      $lookup: {
        from: "studentcourses",
        localField: "_id",
        foreignField: "courseId",
        as: "courseObject"
      }
    },
    
    {
      $project: {
        courseName:1,
        count: 1,
        courseObject: {
          studentId:1,
        }
      }
    },
    {$sort: {"courseObject": -1}},
    
       
  ]);

  let studentcourse = studentCourses.filter(x =>{
    return( x.courseObject.length != 0 )
  })
  
  res.send(studentcourse)

}


const postStudentcourse = async (req, res) => {
  const { isActive, studentId, courseId } = req.body
  const studentcourse = await new Studentcourse({
    isActive,
    studentId,
    courseId

  }).save()
  res.status(201).json(studentcourse)
}

const updateStudentcourse = async (req, res) => {
  console.log("req.body updateStudentcourse api", req.body);
  const { _id, isActive, studentId, courseId, updateBy, updateDate } = req.body
  const studentcourseop = await Studentcourse.findOneAndUpdate(
    { _id: _id },
    { $set: { isActive: isActive, studentId: studentId, courseId: courseId, updateBy:updateBy , updateDate:updateDate } }
  )
  res.status(201).json(studentcourseop)
}

export default (req, res) => handler.run(req, res)