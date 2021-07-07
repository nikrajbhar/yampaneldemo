import Quizze from "../../models/quizze";
import Exam from "../../models/exam";
import Lesson from "../../models/lesson";
import Course from "../../models/course";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getQuizze(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postQuizze(req, res)
});
handler.put(async (req, res) => {
  await updateQuizze(req, res)
});
// handler.delete(async (req, res) => {
//   await deleteCategory(req, res)
// });

const getQuizze = async (req, res) => {
  Quizze.find().populate({ path: 'examId', model: 'exam', populate: { path: 'lessonId', model: 'lesson', populate: { path: 'courseId', model: 'course' } } }).then(quizzes => {
    res.status(200).json({ quizzes })
  })
}


const postQuizze = async (req, res) => {
  const { status, isActive, quizName, examId, lessonId, courseId, detail, questionType, answer, hints, options, marks, createdBy } = req.body
  console.log(req.body);
  const quizze = await new Quizze({
    status,
    isActive,
    quizName,
    examId,
    lessonId,
    courseId,
    detail,
    questionType,
    answer,
    options,
    hints,
    marks,
    createdBy
  }).save()

  if (quizze.isActive) {
    updateExamForAddQuestion(examId, true, true, true, marks);
  }
  res.status(201).json(quizze)
}

const updateExamForAddQuestion = async (examId, marks) => {
  let existingExam = await Exam.findById(examId);
  let newTotalMarks = existingExam.totalMarks + marks;
  let newPassingMarks = Math.round(newTotalMarks * 0.35);
  let newNoOfQuestions = existingExam.noofquestions + 1;
  await Exam.findByIdAndUpdate(examId, { totalMarks: newTotalMarks, passingMarks: newPassingMarks, noofquestions: newNoOfQuestions });
}

const updateExamForEditQuestion = async (examId, isUpdateIsActive, isUpdateMarks, isActive, oldMarks, newMarks) => {
  let existingExam = await Exam.findById(examId);
  let newNoOfQuestions = existingExam.noofquestions;
  let newPassingMarks = existingExam.passingMarks;
  let newTotalMarks = existingExam.totalMarks;
  let isChanged = false;
  if (isUpdateIsActive) {
    isChanged = true;
    newNoOfQuestions = isActive ? existingExam.noofquestions + 1 : existingExam.noofquestions - 1;
  }
  if (isUpdateMarks) {
    isChanged = true;
    newTotalMarks = (existingExam.totalMarks - oldMarks) + newMarks;
    newPassingMarks = Math.round(newTotalMarks * 0.35);
  }
  if (isChanged) {
    await Exam.findByIdAndUpdate(examId, { totalMarks: newTotalMarks, passingMarks: newPassingMarks, noofquestions: newNoOfQuestions });
  }
}

const updateQuizze = async (req, res) => {
  console.log("req.body updateQuizze api", req.body);
  const { _id, status, isActive, quizName, examId, lessonId, courseId, detail, questionType, answer, options, hints, marks, updateBy, updateDate } = req.body
  const quizzeop = await Quizze.findOneAndUpdate(
    { _id: _id },
    { $set: { status: status, isActive: isActive, quizName: quizName, examId: examId, lessonId: lessonId, courseId: courseId, detail: detail, questionType: questionType, answer: answer, options: options, hints: hints, marks: marks, updateBy: updateBy, updateDate: updateDate } }
  )

  if (quizzeop.isActive != isActive || quizzeop.marks != marks) {
    updateExamForEditQuestion(examId, quizzeop.isActive != isActive, quizzeop.marks != marks, isActive, quizzeop.marks, marks);
  }

  res.status(201).json(quizzeop)
}

export default (req, res) => handler.run(req, res)