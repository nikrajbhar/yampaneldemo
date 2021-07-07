import Quizresult from "../../models/quizresult";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();

handler.get(async (req, res) => {
  console.log("get called");
  await getQuizresult(req, res)
});
handler.post(async (req, res) => {
  console.log("getting post");
  await postQuizresult(req, res)
});
handler.put(async (req, res) => {
  await updateCategory(req, res)
});
// handler.delete(async (req, res) => {
//   await deleteCategory(req, res)
// });

const getQuizresult = async (req, res) => {
    Quizresult.find().then(quizresults => {
    res.status(200).json({ quizresults })
  })
}


// getting post response but not displaying in mongodb database

const postQuizresult = async (req, res) => {
  const {isActive, studentId, examId, quizId, answer, obtainedMarks, createdBy } = req.body
  console.log(req.body);
  const quizresult = await new Quizresult({    
    isActive,
    studentId,
    examId,
    quizId,
    answer,
    obtainedMarks,
    createdBy

  }).save()
  res.status(201).json(quizresult)
}

export default (req, res) => handler.run(req, res)