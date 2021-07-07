import Navbar from "./Navbar";
import Head from "next/head";
import { useRouter } from 'next/router';
import {
  QuestionType,
  quillionzURL,
  quillionzAccessToken,
} from "../components/global";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { absoluteUrl } from "../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from "jquery";

export default function question_AI(props) {

  const { lessons, courses, exams } = props;

  const params = new URLSearchParams(window.location.search);
  const courseID = params.get("course");
  const lessonID = params.get("lesson");
  const examID = params.get("exam");

  const [courseList, setCourseList] = useState(courses.course);
  const [lessonList, setLessonList] = useState(lessons);
  const [examList, setExamList] = useState(exams);
  const [userInput, setuserInput] = useState({
    course: courseID,
    lesson: lessonID,
    exam: examID != null && examID != undefined ? examID : "",
    title: lessonList.some((x) => x._id == lessonID)
      ? lessonList.find((x) => x._id == lessonID).lessonName
      : "",
    detail: lessonList.some((x) => x._id == lessonID)
      ? lessonList.find((x) => x._id == lessonID).detail
      : "",
  });
  const [questionList, setQuestionList] = useState([]);
  const [optionError, setOptionError] = useState({
    mainIndex: undefined,
    fieldName: undefined
  })

  const [courseError, setcourseError] = useState()
  const [lessonError, setlessonError] = useState()
  const [examError, setexamError] = useState()
  const [titleError, settitleError] = useState()
  const [contentError, setcontentError] = useState()
  const [mincontentError, setMincontentError] = useState()

  const [stepValue, setStepValue] = useState("Next Step")

  const router = useRouter()
  const logindata = useSelector((state) => state.user);
  var islogged = logindata.islogged    // logindata will consist true or false  
  if (!islogged) {
    router.replace("/")
    return null;
  }
  if ($.isEmptyObject(props)) {
    return <ErrorPage statusCode={404} />;
  }


  const userID = logindata.userdata._id;


  let courseListOptions = courseList.map((course) => {
    return (
      <option key={course._id} value={course._id}>
        {course.courseName}
      </option>
    );
  });

  let optionlessons = (lessons) =>
    lessons.map((lesson) => {
      return (
        <option key={lesson._id} value={lesson._id}>
          {lesson.lessonName}
        </option>
      );
    });

  let examsList = (examsList) =>
    examsList.map((exam) => {
      return (
        <option key={exam._id} value={exam._id}>
          {exam.examName}
        </option>
      );
    });

  let handleRemove = (index) => {
    const values = [...questionList]
    values.splice(index, 1)
    setQuestionList(values)

  }

  let renderQuestionList = (data) =>
    data.map((item, index) => {
      if (item.questionType == QuestionType.multiplechoice) {
        let options = JSON.parse(item.options);
        return (
          <div className="col-12" style={{ marginTop: 50 }}>
            <p style={{ marginTop: 10 }}>
              <b>Questionz {index + 1}:</b> {item.quizName}
            </p>
            <ul className="options" style={{ backgroundColor: "red" }}>
              {options.map((otn) => {
                return <li>{otn}</li>;
              })}
            </ul>
            <p style={{ marginTop: 10 }}>
              <b>Answer {index + 1}:</b> {item.answer}
            </p>
            {item.hints ? (
              <p style={{ marginTop: 10 }}>
                <b>Hint:</b> {item.hints}
              </p>
            ) : null}
          </div>
        );
      } else {
        return (
          <div className="col-12" style={{ marginTop: 50 }}>
            <span className="text-danger" style={{ float: 'right' }} onClick={() => handleRemove(index)}>
              <i className="fa fa-minus-circle"></i>
            </span>
            <p style={{ marginTop: 10 }}>
              <b>Questions {index + 1}:</b> <input name='quizName' style={{ color: '#9E9E9E' }} type="text" size='100' value={item.quizName} onChange={event => handleChangeInput(index, event)} required />
            </p>
            {optionError.mainIndex == index && optionError.fieldName == 'quizName' ? <small className="text-danger"> Please fill this required field! </small> : null}
            <p style={{ marginTop: 10 }}>
              <b>Answer {index + 1}:</b> <input name='answer' style={{ color: '#9E9E9E' }} type="text" size='100' value={item.answer} onChange={event => handleChangeInput(index, event)} required />  </p>
            {optionError.mainIndex == index && optionError.fieldName == 'answer' ? <small className="text-danger"> Please fill this required field! </small> : null}

            <p style={{ marginTop: 10 }}>
              <b>Hint:</b>  <input name='hints' style={{ color: '#9E9E9E' }} type="text" size='100' value={item.hints} onChange={event => handleChangeInput(index, event)} required />
              {optionError.mainIndex == index && optionError.fieldName == 'hints' ? <small className="text-danger"> Please fill this required field! </small> : null}
            </p>

          </div>
        );
      }
    });

  const handleChangeInput = (index, event) => {

    let values = [...questionList];
    values[index][event.target.name] = event.target.value;
    setQuestionList(values); //object
    setOptionError({
      mainIndex: undefined,
      fieldName: undefined
    })
  }


  const selectCourse = async (event) => {
    const value = event.target.value;
    if (value != "") {
      let response = await fetch(
        `/api/lessonsByCourse?courseId=${value}`
      );
      let rsp = await response.json();
      setLessonList(rsp);
      setExamList([]);
      setuserInput({
        course: value,
        lesson: "",
        exam: "",
        title: "",
        detail: "",
      });
    } else {
      setLessonList([]);
      setExamList([]);
      setuserInput({ course: "", lesson: "", exam: "", title: "", detail: "" });
    }
  };

  const selectLesson = async (event) => {
    const value = event.target.value;
    if (value != "") {
      let response = await fetch(`/api/examsByLesson?lessonId=${value}`);
      let rsp = await response.json();
      let currentLesson = lessonList.find((x) => x._id == value);
      setExamList(rsp);
      setuserInput({
        course: userInput.course,
        lesson: value,
        exam: "",
        title: currentLesson.lessonName,
        detail: currentLesson.detail,
      });
    } else {
      setExamList([]);
      setuserInput({
        course: userInput.course,
        lesson: "",
        exam: "",
        title: "",
        detail: "",
      });
    }
  };

  const selectExam = async (event) => {
    const value = event.target.value;
    setuserInput({ ...userInput, exam: value });
  };

  var words = userInput.detail
  var count = 0;
  var i;
  var split = words.split(' ');
  for (i = 0; i < split.length; i++) {
    if (split[i] != "") {
      count += 1;
    }
  }
  const onNextClick = async (event) => {
    let id = event.target.id;
    if (id == "next-step-1") {
      // step 1 validation here
      if (
        userInput.course == "" ||
        userInput.course == undefined ||
        userInput.course == null
      ) {
        setcourseError(" Please select this required field")
        return;
      } else { setcourseError("") }
      if (
        userInput.lesson == "" ||
        userInput.lesson == undefined ||
        userInput.lesson == null
      ) {
        setlessonError(" Please select this required field")
        return;
      } else { setlessonError("") }
      if (
        userInput.exam == "" ||
        userInput.exam == undefined ||
        userInput.exam == null
      ) {
        setexamError(" Please select this required field")
        return;
      } else { setexamError("") }
      window.showNextStep(id);
    } else if (id == "next-step-2") {
      if (
        userInput.title == "" ||
        userInput.title == undefined ||
        userInput.title == null
      ) {
        settitleError(" Please Enter Content Title.")
        return;
      } else { settitleError("") }
      if (
        userInput.detail == "" ||
        userInput.detail == undefined ||
        userInput.detail == null
      ) {
        setcontentError(" Please Enter Content")
        return;
      } else {
        let str = userInput.detail + "";
        str = str.replace(/(^\s*)|(\s*$)/gi, "");
        str = str.replace(/[ ]{2,}/gi, " ");
        str = str.replace(/\n /, "\n");
        let strWords = str.split(" ").length;
        if (strWords < 300 || strWords > 3000) {
          setMincontentError("Entered content must be between 300 to 3000 words.")
          // alert("Entered content must be between 300 to 3000 words.");
          return;
        } else { setMincontentError("") }
      }
      $(`#${id}`).val("Wait...");
      $(`#${id}`).attr("disabled", "disabled");

      setStepValue('Wait...')

      await getQuestionsFromContent(id);
      setStepValue('Next Step')

    }
  };

  const onPreviousClick = (event) => {
    let id = event.target.id;
    window.showPreviousStep(id);
  };

  const getQuestionsFromContent = async (id) => {
    //#region get access token
    // let details = {
    //     'grant_type': 'client_credentials'
    // }
    // let formBody = [];
    // for (var property in details) {
    //     var encodedKey = encodeURIComponent(property);
    //     var encodedValue = encodeURIComponent(details[property]);
    //     formBody.push(encodedKey + "=" + encodedValue);
    // }
    // formBody = formBody.join("&");
    // let tokenResponse = await fetch(`${quillionzURL}token`, {
    //     method: 'POST',
    //     // mode: 'no-cors',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         'Authorization': 'Basic ' + base64.encode(quillionzConsumerKey + ":" + quillionzConsumerSecret),
    //         'Access-Control-Allow-Origin': '*'
    //     },
    //     body: formBody
    // });
    // let tokenRsp = await tokenResponse.json();
    // console.log("=---------------");
    // console.log(tokenRsp);
    //#endregion

    let mainResponse = await fetch(
      `${quillionzURL}quillionzapifree/1.0.0/API/SubmitContent_GetQuestions?shortAnswer=false&recall=true&mcq=true&whQuestions=false&title=${userInput.title}`,
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "text/plain",
          Authorization: "Bearer " + quillionzAccessToken,
        },
        body: userInput.detail,
      }
    );
    let mainRsp = await mainResponse.json();

    if (mainRsp.error) {
      alert(mainRsp.error.message);
      $(`#${id}`).val("Next Step");
      $(`#${id}`).removeAttr("disabled");
      return;
    } else {
      if (mainRsp.Data) {
        if (
          mainRsp.Data.Error != undefined &&
          mainRsp.Data.Error != null &&
          mainRsp.Data.Error != ""
        ) {
          alert(mainRsp.Data.Error);
          $(`#${id}`).val("Next Step");
          $(`#${id}`).removeAttr("disabled");
          return;
        } else {
          processQuestionData(mainRsp.Data, id);
        }
      }
    }
  };

  const processQuestionData = (data, id) => {
    let result = [];
    let recall = data.recall != undefined ? data.recall : [];
    let trueFalse =
      data.multipleChoiceQuestions != undefined &&
        data.multipleChoiceQuestions.trueFalse != undefined
        ? data.multipleChoiceQuestions.trueFalse
        : [];
    let whQuestions = data.whQuestions != undefined ? data.whQuestions : [];
    let questionVariations =
      whQuestions.questionVariations != undefined
        ? whQuestions.questionVariations
        : [];
    recall.map((item, index) => {
      result.push({
        quizName: item.Question,
        examId: userInput.exam,
        lessonId: userInput.lesson,
        courseId: userInput.course,
        detail: "", // discuss
        questionType: QuestionType.text,
        answer: item.Answer,
        hints: item.originalSentence,
        marks: 5, // discuss
        createdBy: userID,
      });
    });
    trueFalse.map((item, index) => {
      let randomIndex = Math.random() >= 0.5 ? 1 : 0;
      result.push({
        quizName: item.questionList[randomIndex].question,
        examId: userInput.exam,
        lessonId: userInput.lesson,
        courseId: userInput.course,
        detail: "", // discuss
        questionType: QuestionType.multiplechoice,
        options: JSON.stringify(["True", "False"]),
        answer: item.questionList[randomIndex].answer,
        hints: item.questionList[randomIndex].correctSent,
        marks: 5, // discuss
        createdBy: userID,
      });
    });
    questionVariations.map((item) => {
      item.questionList.sort((a, b) => {
        return Number(a.AnswerScore) - Number(b.AnswerScore);
      });
      result.push({
        quizName: item.questionList[0].Question,
        examId: userInput.exam,
        lessonId: userInput.lesson,
        courseId: userInput.course,
        detail: "", // discuss
        questionType: QuestionType.text,
        answer: item.questionList[0].Answer,
        hints: item.questionList[0].Answer, // discuss: if no hints available then save answer in it.
        marks: 5, // discuss
        createdBy: userID,
      });
    });
    setQuestionList(result);
    $(`#${id}`).val("Next Step");
    $(`#${id}`).removeAttr("disabled");
    window.showNextStep(id);
  };
  function isValid() {

    let newOptionError = { ...optionError }
    for (let i = 0; i < questionList.length; i++) {
      if (!questionList[i].quizName) {
        newOptionError.mainIndex = i;
        newOptionError.fieldName = 'quizName'
        break;
      }
      if (!questionList[i].answer) {
        newOptionError.mainIndex = i;
        newOptionError.fieldName = 'answer'
        break;
      }
      if (!questionList[i].hints) {
        newOptionError.mainIndex = i;
        newOptionError.fieldName = 'hints'
        break;
      }
    }

    setOptionError(newOptionError)
    return newOptionError.mainIndex == undefined && newOptionError.fieldName == undefined
  }
  const importQuestions = async (event) => {
    if (isValid()) {
      let response = await fetch(
        `/api/questions/add?examId=${userInput.exam}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(questionList),
        }
      );
      let rsp = await response.json();

      if (rsp.success) {
        alert("Questions imported successfully!");
        router.replace("/lessons");
      } else {
        alert("Error while importing! Please Try again.");
      }
    }
  };

  return (
    <>
      {/* <style jsx>{`
        .options li {
          list-style: none;
          list-style-type: lower-alpha;
        }
      `}</style> */}
      <Head>
        <title>Lessons</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />

      <div className="container-fluid" id="grad1">
        <div className="row justify-content-center mt-0">
          <div className="col-11 col-sm-9 col-md-7 col-lg-6 text-center p-0 mt-3 mb-2">
            <div className="card px-0 pt-4 pb-0 mt-3 mb-3">
              <h2>
                <strong>Question AI</strong>
              </h2>
              <p>Fill all form field to go to next step</p>
              <div className="row">
                <div className="col-md-12 mx-0">
                  <form id="msform">
                    <ul id="progressbar">
                      <li className="active">
                        <strong>Course details</strong>
                      </li>
                      <li id="personal">
                        <strong>Lessons details</strong>
                      </li>
                      <li id="payment">
                        <strong>AI generated questions</strong>
                      </li>
                    </ul>

                    <fieldset>
                      <div className="form-card">
                        {/* <h2 className="fs-title">Select</h2> */}

                        <label className="form-label">
                          Select Course <span className="text-danger">*</span>{" "}
                        </label>
                        <select
                          className="form-control"
                          name="course"
                          value={userInput.course}
                          onChange={selectCourse}
                          tabIndex="-98"
                        >
                          <option key={0} value="">
                            Select Course
                          </option>
                          {courseListOptions}
                        </select>
                        <small className="text-danger">{courseError}</small>
                        <br />

                        <label className="form-label">
                          Select Lesson <span className="text-danger">*</span>{" "}
                        </label>
                        <select
                          className="form-control"
                          name="lesson"
                          value={userInput.lesson}
                          onChange={selectLesson}
                          tabIndex="-98"
                        >
                          <option value="">Select Lesson</option>
                          {optionlessons(lessonList)}
                        </select>
                        <small className="text-danger">{lessonError}</small>
                        <br />

                        <label className="form-label">
                          Select Exam <span className="text-danger">*</span>{" "}
                        </label>
                        <select
                          className="form-control"
                          name="exam"
                          value={userInput.exam}
                          onChange={selectExam}
                          tabIndex="-98"
                        >
                          <option value="">Select Exam</option>
                          {examsList(examList)}
                        </select>
                        <small className="text-danger">{examError}</small>
                        <br />
                      </div>
                      <input
                        type="button"
                        id="next-step-1"
                        name="next"
                        className="next action-button"
                        value="Next Step"
                        onClick={onNextClick}
                      />
                    </fieldset>

                    <fieldset>
                      <div className="form-card">
                        <label className="form-label">
                          Title <span className="text-danger">*</span>{" "}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="title"
                          value={userInput.title}
                          onChange={(event) =>
                            setuserInput({
                              ...userInput,
                              title: event.target.value,
                            })
                          }
                        />
                        <small className="text-danger">{titleError}</small>
                        <br />
                        <label className="form-label">
                          Content <span className="text-danger">*</span>{" "}
                        </label>
                        <textarea
                          className="form-control"
                          rows="5"
                          name="detail"
                          value={userInput.detail}
                          onChange={(event) =>
                            setuserInput({
                              ...userInput,
                              detail: event.target.value,
                            })
                          }
                        />
                        <small className="text-danger">{contentError} {mincontentError}</small> <span style={{ float: 'right' }}> Words : {count}</span>
                      </div>

                      <input
                        type="button"
                        id="pre-step-2"
                        name="previous"
                        className="previous action-button-previous"
                        value="Previous"
                        onClick={onPreviousClick}
                      />

                      <input
                        type="button"
                        id="next-step-2"
                        name="next"
                        className="next action-button"
                        value={stepValue}
                        onClick={onNextClick}
                      />
                    </fieldset>

                    <fieldset>
                      <div className="form-card">
                        <h2 className="fs-title">Question List:</h2>
                        {renderQuestionList(questionList)}
                      </div>

                      <input
                        type="button"
                        id="pre-step-3"
                        name="previous"
                        className="previous action-button-previous"
                        value="Previous"
                        onClick={onPreviousClick}
                      />
                      <input
                        type="button"
                        name="submit"
                        className="next action-button"
                        value="Import Questions"
                        style={{ width: 200 }}
                        onClick={importQuestions}
                      />
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  var { req, res, query } = ctx
  var { token } = parseCookies(ctx)
  try {
    if (token) {
      const { url } = absoluteUrl(req);
      const courseId = query.course;
      const lessonId = query.lesson;
      const [newlessonRes, courseRes, examRes] = await Promise.all([
        fetch(`${url}/api/lessonsByCourse?courseId=${courseId}`, {
          headers: {
            'Authorization': token,
          }
        }),
        fetch(`${url}/api/courseapi`, {
          headers: {
            'Authorization': token,
          }
        }),
        fetch(`${url}/api/examsByLesson?lessonId=${lessonId}`, {
          headers: {
            'Authorization': token,
          }
        }),
      ]);
      const [lessons, courses, exams] = await Promise.all([
        newlessonRes.json(),
        courseRes.json(),
        examRes.json(),
      ]);
      return { props: { lessons, courses, exams } };
    } else {
      return { props: {} };
    }
  } catch (error) {
    res.statusCode = 404;
    return { props: {} };
  }
}
