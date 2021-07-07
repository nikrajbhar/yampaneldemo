import Navbar from "../Navbar"
import Head from 'next/head'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import React, { useState } from 'react';
import Link from 'next/link';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { QuestionType } from "../../components/global"
import { absoluteUrl } from "../../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from 'jquery';

export default function question(props) {

    const { question, exams } = props;

    const [userInput, setuserInput] = useState({
        question_name: question.quizName,
        question_no: "",
        question_details: question.detail,
        hint: question.hints,
        marks: question.marks,
        answer: question.answer,
        question_type: question.questionType,
        select_exam: question.examId,
        select_lesson: "",
        select_course: "",

    })
    const [btn, setbtn] = useState("Submit")
    const [assessment, setAssessment] = useState(question.examId);
    const [lesson, setLesson] = useState(question.lessonId);
    const [course, setCourse] = useState(question.courseId);

    const [checkbox, setcheckbox] = useState(question.isActive)

    const [maxOptionError, setmaxOptionError] = useState();
    const [nameError, setnameError] = useState()
    const [detailError, setdetailError] = useState()
    const [examError, setexamError] = useState()
    const [typeError, settypeError] = useState()
    const [answerError, setanswerError] = useState()
    const [hintError, sethintError] = useState()
    const [marksError, setmarksError] = useState()
    const [optionError, setoptionError] = useState([])
    const [optionnullError, setoptionnull] = useState()

    let newanyname = question.options
    let newanynamearray = []

    { newanyname ? newanynamearray = JSON.parse(newanyname) : null }

    // let anyname = '["Looks","Moon","The","Beautiful"]'
    // let newarray = JSON.parse(anyname)

    const [optionInputs, setoptionInputs] = useState(newanynamearray);


    const router = useRouter()
    const logindata = useSelector((state) => state.user);
    var islogged = logindata.islogged    // logindata will consist true or false  
    if (!islogged) {
        router.replace("/");
        return null;
    }
    if ($.isEmptyObject(props)) {
        return <ErrorPage statusCode={404} />;
    }

    var userID;
    { islogged ? userID = logindata.userdata._id : null }

    var token = logindata.token
    
    var examsList = exams.exams.map(exam => {
        return (
            <option key={exam._id} value={exam._id}>{exam.examName}</option>
        )
    })

    const handleAdd = () => {
        { optionInputs.length <= 3 ? setoptionInputs([...optionInputs, ""]) : setmaxOptionError(" * Maximum 4 options Only !") }
    }
    const handleRemove = (index) => {

        const values = [...optionInputs]
        values.splice(index, 1)
        setoptionInputs(values)
    }

    function isValid() {

        let isValid = true
        if (userInput.question_name == "") {
            isValid = false
            setnameError("Please fill this required field !")
        } else {
            setnameError("")
        }
        if (userInput.question_details == "") {
            isValid = false
            setdetailError(" Please fill this required field !")
        } else {
            setdetailError("")
        }
        if (assessment == "") {
            isValid = false
            setexamError(" Please fill this required field !")
        } else {
            setexamError("")
        }
        if (userInput.question_type == "") {
            isValid = false
            settypeError(" Please fill this required field !")
        } else {
            settypeError("")
        }
        if (userInput.answer == "") {
            isValid = false
            setanswerError(" Please fill this required field !")
        } else {
            setanswerError("")
        }
        if (userInput.hint == "") {
            isValid = false
            sethintError(" Please fill this required field !")
        } else {
            sethintError("")
        } if (userInput.marks == "") {
            isValid = false
            setmarksError(" Please fill this required field !")
        } else {
            setmarksError("")
        }
        if (userInput.question_type == QuestionType.multiplechoice && optionInputs.length == 0) {
            isValid = false
            setoptionnull(" Please add an Options !")
        } else {
            if (optionInputs.length < 2) {
                setoptionnull(" Minimum 2 options required!")
            } else {
                setoptionnull("")
            }
        }

        let array = []
        optionInputs.map((optionInput, i) => {
            // console.log('option', optionInput);
            // console.log('optionI', i);
            if (optionInput == '' || optionInput == undefined || optionInput == null) {
                array.push(i)
                isValid = false
            }

        })
        setoptionError(array)

        return isValid
    }

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setuserInput({ ...userInput, [name]: value })
    }

    const handleChangeInput = (index, event) => {
        let values = [...optionInputs];
        values[index] = event.target.value;
        setoptionInputs(values); //object
    }

    const handleAssessment = async (event) => {
        const value = event.target.value;
        setAssessment(value)
        if (value != "") {
            let response = await fetch(`/api/lessonByexam?Id=${value}`, {
                headers: {
                    'Authorization': token,
                }
            });
            let rsp = await response.json();
            setLesson(rsp.lessonId)
            setCourse(rsp.courseId)
        } else {
            setLesson('')
            setCourse('')
        }
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isValid()) {
            setbtn("Wait...")
            // var newRecord = { ...userInput }
            // console.log("Submitted data", newRecord);

            const res = await fetch(`/api/quizzeapi`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    _id: question._id,
                    status: 0,
                    isActive: checkbox,
                    quizName: userInput.question_name,
                    examId: assessment,
                    lessonId: lesson,
                    courseId: course,
                    detail: userInput.question_details,
                    questionType: userInput.question_type,
                    answer: userInput.answer,
                    hints: userInput.hint,
                    marks: userInput.marks,
                    options: JSON.stringify(optionInputs),
                    updateBy: userID,
                    updateDate: Date.now()
                })
            })

            console.log("res.status", res.status);


            { res.status == 201 ? toast.success('Edited Successfully') : toast.error('Not Submitted') }
            { res.status == 201 ? router.push('/questions') : toast.error('Not Submitted') }
        }

    }

    return (
        <>
            <Head>
                <title>Edit Question</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {islogged ?
                <div className="page-wrapper">

                    <Navbar />


                    {/* <!-- PAGE CONTENT-->  */}
                    <div className="page-content">

                        {/* <!-- WELCOME--> */}
                        <section className="welcome p-t-10">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="title-4">
                                            Edit Question
                                        </h1>
                                        <hr className="line-seprate" />
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- END WELCOME-->
            <!-- MAIN CONTENT--> */}
                        <div className="main-content">
                            <div className="section__content section__content--p30">
                                <div className="container">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Question <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="question_name" value={userInput.question_name} onChange={handleInput} />
                                                    {userInput.question_name ? null : <small className="text-danger">{nameError}</small>}
                                                </div>
                                            </div>
                                            {/* <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label className="form-label">Question No</label>
                                        <input type="text" className="form-control" name="question_no" value={userInput.question_no} onChange={handleInput} />
                                    </div>
                                </div> */}
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Question Details <span className="text-danger">*</span></label>
                                                    <textarea className="form-control" rows="5" name="question_details" value={userInput.question_details} onChange={handleInput} />
                                                    {userInput.question_details ? null : <small className="text-danger">{detailError}</small>}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Assessment <span className="text-danger">*</span></label>

                                                    <select className="form-control" name="select_exam" value={assessment} onChange={handleAssessment} tabIndex="-98" >
                                                        <option key={0} value="">Select Assessment</option>
                                                        {examsList}
                                                    </select>
                                                    {assessment ? null : <small className="text-danger">{examError}</small>}
                                                </div>

                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Type <span className="text-danger">*</span></label>

                                                    <select className="form-control" name="question_type" value={userInput.question_type} onChange={handleInput} tabIndex="-98" >
                                                        <option key={0} value="">Select Type</option>
                                                        <option value={QuestionType.text}>Text</option>
                                                        <option value={QuestionType.multiplechoice}>Multichoice</option>
                                                    </select>
                                                    {userInput.question_type ? null : <small className="text-danger">{typeError}</small>}

                                                </div>
                                            </div>

                                            {userInput.question_type == QuestionType.multiplechoice ? <>
                                                <div className="col-lg-6 col-md-6 col-sm-12">
                                                    <div className="row">
                                                        {optionInputs.map((optionInput, index) => (
                                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                                <div key={index}>
                                                                    <div className="form-group">
                                                                        <label>Option {index + 1} </label> <span className="text-danger" style={{ float: 'right' }} onClick={() => handleRemove(index)}  ><i className="fa fa-minus-circle"></i></span>
                                                                        <input type="text" name='option' className="form-control" value={optionInput} onChange={event => handleChangeInput(index, event)} />
                                                                        {optionError.some((x) => x == index) ? <small className="text-danger"> Please fill this required field ! </small> : null}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                    <div className="form-group">
                                                        {optionInputs.length <= 3 ? <label className="form-label" onClick={() => handleAdd()} ><i className="fa fa-plus-circle"></i> Add more </label> : null}
                                                        <small className="text-danger" style={{ marginLeft: 10 }}>{maxOptionError}</small><small className="text-danger">{optionnullError}</small>
                                                    </div>
                                                </div>

                                            </>
                                                : null}
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Answer <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="answer" value={userInput.answer} onChange={handleInput} />
                                                    {userInput.answer ? null : <small className="text-danger">{answerError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Hint <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="hint" value={userInput.hint} onChange={handleInput} />
                                                    {userInput.hint ? null : <small className="text-danger">{hintError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Marks <span className="text-danger">*</span></label>
                                                    <input type="number" className="form-control" name="marks" value={userInput.marks} onChange={handleInput} />
                                                    {userInput.marks ? null : <small className="text-danger">{marksError}</small>}
                                                </div>
                                                <div className="form-group form-check">
                                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" name="isActive" onChange={event => setcheckbox(event.target.checked)} defaultChecked={checkbox} />
                                                    <label className="form-check-label" htmlFor="exampleCheck1">Active</label>

                                                </div>
                                            </div>





                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-primary">{btn}</button>
                                                    <Link href="/questions">
                                                        <a style={{ marginLeft: 10 }} className="btn btn-danger">
                                                            Cancel
                                                        </a>
                                                    </Link>

                                                </div>
                                            </div>
                                        </div>
                                    </form>


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                : null}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export async function getServerSideProps(ctx) {
    var { req, params: { id }, res } = ctx
    var { token } = parseCookies(ctx)
    try {
        if (token) {
            const { url } = absoluteUrl(req);
            const [questionRes, examRes,] = await Promise.all([
                fetch(`${url}/api/question/${id}`, {
                    headers: {
                        'Authorization': token,
                    }
                }),
                fetch(`${url}/api/examapi`, {
                    headers: {
                        'Authorization': token,
                    }
                }),

            ]);
            const [question, exams] = await Promise.all([
                questionRes.json(),
                examRes.json(),

            ]);
            return { props: { question, exams } };
        } else {
            return { props: {} };
        }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }

}

