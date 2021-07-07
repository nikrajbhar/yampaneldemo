import Exam from "../../models/exam";
import Lesson from "../../models/lesson";
import Course from "../../models/course";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getExam(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postExam(req, res)
});
handler.put(async (req, res) => {
  await updateExam(req, res)
});
// handler.delete(async (req, res) => {
//   await deleteCategory(req, res)
// });

const getExam = async (req, res) => {
    Exam.find().populate({path:'lessonId', model:'lesson',populate:{path:'courseId', model:'course'}}).then(exams => {
    res.status(200).json({ exams })
  })
}
// .populate("languageId")
// "languageName"

const postExam = async (req, res) => {
  const {isActive, examName, detail, lessonId, courseId, duration,  noofquestions, image ,createdBy } = req.body
  console.log(req.body);
  const exam = await new Exam({    
    isActive,
    examName,
    lessonId,
    courseId,
    detail,
    duration,    
    // totalMarks,    
    // passingMarks,
    noofquestions,
    image,
    createdBy
  }).save()
  res.status(201).json(exam)
}

const updateExam = async (req, res) => {
  console.log("req.body categori api", req.body);
  const {_id, isActive, examName, lessonId, courseId, detail, duration,  image, updateBy, updateDate } = req.body
  const examop = await Exam.findOneAndUpdate(
    { _id: _id },
    { $set: {isActive: isActive, examName: examName,  lessonId:lessonId, courseId:courseId, detail:detail, duration:duration, lessonId:lessonId, image:image, updateBy: updateBy , updateDate: updateDate  } }
  )
  res.status(201).json(examop)
}

export default (req, res) => handler.run(req, res)