import Studentexam from "../../models/studentexam";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getStudentexam(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postStudentexam(req, res)
});
handler.put(async (req, res) => {
  await updateStudentexam(req, res)
});
// handler.delete(async (req, res) => {
//   await deleteCategory(req, res)
// });

const getStudentexam = async (req, res) => {
    Studentexam.find().then(studentexams => {
    res.status(200).json({ studentexams })
  })
}


const postStudentexam = async (req, res) => {
  const {isActive, studentId, examId, lessonId, courseId  } = req.body
  console.log(req.body);
  const studentexam = await new Studentexam({    
    isActive,
    studentId,
    examId,
    lessonId,
    courseId
  }).save()
  res.status(201).json(studentexam)
}

export default (req, res) => handler.run(req, res)