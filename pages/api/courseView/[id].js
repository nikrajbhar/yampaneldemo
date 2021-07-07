import Course from "../../../models/course";
import Categorie from "../../../models/categorie";
import Language from "../../../models/language";
import User from "../../../models/user";
import Studentcourse from "../../../models/studentcourse";
import Studentexam from "../../../models/studentexam";
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
  const course = await Course.findOne({ _id: id }).populate('categoryId', 'categoryName').populate('languageId', 'languageName').populate('teacherId', 'firstName')
  const courseLearning = await Studentcourse.find({ courseId: id, percentage: { $lte: 99 } }).countDocuments()
  const courseCompleted = await Studentcourse.find({ courseId: id, percentage: 100 })

  let studentId = courseCompleted.map(x => x.studentId)
  // console.log(studentId,studentId);
  let studentexamsop = await Studentexam.find({ studentId: { $in: studentId } }).populate("examId", "passingMarks").select({ "percentage": 1, "obtainedMarks": 1, "examId": 1, "courseId": 1, "lessonId":1 })
  let semiFinalres = studentexamsop.filter(x => {
    return x.courseId == id
  })
  
  // console.log('semiFinalres',semiFinalres);

  var pass = 0;
  var fail = 0;
  for (let i = 0; i < semiFinalres.length; i++) {
    const obtainedMarks = semiFinalres[i].obtainedMarks;
    const passingMarks = semiFinalres[i].examId.passingMarks;

    if (obtainedMarks > passingMarks) {
      pass += 1;
    } else {
      fail += 1;
    }
  }
  let finalpercentage = [0, 0];
  let passPercent = Math.round((pass / semiFinalres.length) * 100);
  let failPercent = Math.round((fail / semiFinalres.length) * 100);
  // finalpercentage = [passPercent, failPercent]
   finalpercentage = [pass, fail]
  console.log('finalpercentage',finalpercentage);

  res.status(200).json({ course, courseLearning, courseCompleted, finalpercentage})
  // res.status(200).json(course)
}
// const getLessons = async (req, res) => {
//   Lesson.find().populate({path:'courseId', model:'course'}).then(lessons => {
//   res.status(200).json({ lessons })
// })
// }

const deleteCourse = async (req, res) => {
  console.log('query', req.query);
  const { id } = req.query
  await Course.findByIdAndDelete({ _id: id })
  res.status(200).json({})
}

export default (req, res) => handler.run(req, res)