
import Studentexam from "../../models/studentexam";
import Exam from "../../models/exam";
import createHandler from "../../mongoose/createHandler";
const handler = createHandler();


handler.get(async (req, res) => {
  console.log("get called");
  await getExamResult(req, res)
});

const getExamResult = async (req, res) => {
  Studentexam.find({percentage:100},{ percentage: 1, obtainedMarks: 1, examId: 1 }).populate("examId","passingMarks").then(exams => {
  var pass = 0;
  var fail = 0;
  for (let i = 0; i < exams.length; i++) {
    const obtainedMarks = exams[i].obtainedMarks;
    const passingMarks = exams[i].examId.passingMarks;
  
    if (obtainedMarks > passingMarks) {
      pass += 1;
    } else {
      fail += 1;
    }
  }
  let finalValue = [0,0];
  let passPercent = Math.round((pass / exams.length) * 100);
  let failPercent = Math.round((fail / exams.length) * 100);
  finalValue = [passPercent,failPercent]
  console.log(finalValue);
  res.status(200).json(finalValue)

})
}


export default (req, res) => handler.run(req, res)




// const getResult = async (req, res) => {
//   console.log("get called....");
//   const studentexam = await User.aggregate([
//     { $match : { userType : 3 } },
//     {
//       $lookup: {
//         from: "quizresults",
//         localField: "_id",
//         foreignField: "studentId",
//         as: "studentgivenExam"
//       }
//     },])
//   console.log('studentgivenExam', studentexam);
//   let filterResult = studentexam.map(x=>{
//     return x.studentgivenExam == true
//   })
//   console.log('filterResult',filterResult);
//   res.send(studentexam)
// }