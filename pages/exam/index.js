
import Navbar from "../Navbar"
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head'
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiURL } from "../../components/global";
import { absoluteUrl } from "../../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from "jquery";

export default function exam(props) {
    const { lessons } = props;

    const [exam, setexam] = useState({
        exam_name: "",
        exam_details: "",
        passing_marks: "",
        total_marks: "",
        duration: "",
        lesson: "",

    })

    const [image, setImage] = useState()
    const [lesson, setLesson] = useState()
    const [sampleImage, setsampleImage] = useState()
    const [course, setCourse] = useState()
    const [checkbox, setcheckbox] = useState(false)
    const [btn, setbtn] = useState("Submit")

    const [nameError, setnameError] = useState()
    const [detailError, setdetailError] = useState()
    // const [passingmarksError, setpassingmarksError] = useState()
    // const [totalmarksError, settotalmarksError] = useState()
    const [durationError, setdurationError] = useState()
    const [lessonError, setlessonError] = useState()
    const [imageError, setimageError] = useState()


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

    let optionlessons = lessons.lessons.map(lesson => {
        return (
            <option key={lesson._id} value={lesson._id}>{lesson.lessonName}</option>
        )
    });


    var token = logindata.token
    const uploadPhoto = async (e) => {
        const file = image;
        const data = new FormData();
        data.append('image_data', JSON.stringify({ imageUrl: null, isProfile: false }));
        data.append('image', file);
        const res = await fetch(`${apiURL}/api/image/upload`, {
            method: "POST",
            headers: {
                'Authorization': token,
            },
            body: data
        })

        let finalResponse = await res.json();
        return finalResponse.imageUrl

    }

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setexam({ ...exam, [name]: value })
    }

    const handleLesson = async (event) => {
        const value = event.target.value;
        setLesson(value)
        if (value != "") {
            let courseId = lessons.lessons.find(x => x._id == value).courseId
            setCourse(courseId)
        } else {
            setCourse('')
        }
    }

    const changeSampleImage = (e) => {
        var binaryData = [];
        binaryData.push(e.target.files[0]);
        setsampleImage(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })))
        setImage(e.target.files[0])
    }

    function isValid() {
        let isValid = true
        if (exam.exam_name == "") {
            isValid = false
            setnameError("Please fill this required field !")
        } else {
            setnameError("")
        }
        if (exam.exam_details == "") {
            isValid = false
            setdetailError(" Please fill this required field !")
        } else {
            setdetailError("")
        }
        // if (exam.passing_marks == "") {
        //     isValid = false
        //     setpassingmarksError(" Please fill this required field !")
        // } else {
        //     setpassingmarksError("")
        // }
        // if (exam.total_marks == "") {
        //     isValid = false
        //     settotalmarksError(" Please fill this required field !")
        // } else {
        //     settotalmarksError("")
        // }
        if (exam.duration == "") {
            isValid = false
            setdurationError(" Please fill this required field !")
        } else {
            setdurationError("")
        }

        if (lesson == "" || lesson == undefined) {
            isValid = false
            setlessonError(" Please select this required field !")
        } else {
            setlessonError("")
        }

        if (image == "" || image == null || image == undefined) {
            isValid = false
            setimageError("Please Upload an Image !")
        } else {
            setimageError("")
        }
        return isValid

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isValid()) {
            setbtn("Wait...")

            let mediaUrl = await uploadPhoto()

            const res = await fetch(`/api/examapi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    isActive: checkbox,
                    examName: exam.exam_name,
                    lessonId: lesson,
                    courseId: course,
                    detail: exam.exam_details,
                    duration: exam.duration,
                    // totalMarks: exam.total_marks,
                    // passingMarks: exam.passing_marks,
                    image: mediaUrl,
                    createdBy: userID

                })
            })
            console.log("res.status", res.status);
            { res.status === 201 ? toast.success('Submitted Successfully') : toast.error('Not Submitted !', { position: "top-center", autoClose: 2000, }) }
            setbtn("Submit")
            setLesson('')
            setsampleImage('')
            setImage(null)
            setexam({
                exam_name: "",
                exam_details: "",
                passing_marks: "",
                total_marks: "",
                duration: "",
                lesson: "",

            })
        }
    }

    return (
        <>
            <Head>
                <title>Add Assessment</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            {islogged ?
                <div className="page-wrapper">


                    <Navbar />

                    {/* <!-- PAGE CONTENT--> */}
                    <div className="page-content">

                        {/* <!-- WELCOME--> */}
                        <section className="welcome p-t-10">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="title-4">
                                            Add Assessment
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
                                                    <label className="form-label">Assessment Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="exam_name" value={exam.exam_name} onChange={handleInput} />
                                                    {exam.exam_name ? null : <small className="text-danger">{nameError}</small>}
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Assessment Details <span className="text-danger">*</span> </label>
                                                    <textarea className="form-control" rows="5" name="exam_details" value={exam.exam_details} onChange={handleInput} />
                                                    {exam.exam_details ? null : <small className="text-danger">{detailError}</small>}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">

                                                <label className="form-label">Lesson <span className="text-danger">*</span> </label>

                                                <select className="form-control" name="lesson" value={lesson} onChange={handleLesson} tabIndex="-98">
                                                    <option key={0} value="">Select Lesson</option>
                                                    {optionlessons}
                                                </select>
                                                {lesson ? null : <small className="text-danger">{lessonError}</small>}

                                            </div>
                                            {/* <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Total marks <span className="text-danger">*</span> </label>
                                                    <input type="number" className="form-control" name="total_marks" value={exam.total_marks} onChange={handleInput} />
                                                    <small className="text-danger">{totalmarksError}</small>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Passing marks <span className="text-danger">*</span> </label>
                                                    <input type="number" className="form-control" name="passing_marks" value={exam.passing_marks} onChange={handleInput} />
                                                    <small className="text-danger">{passingmarksError}</small>
                                                </div>
                                            </div> */}

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Assessment Duration (In minutes) <span className="text-danger">*</span> </label>
                                                    <input type="number" className="form-control" name="duration" value={exam.duration} onChange={handleInput} />
                                                    {exam.duration ? null : <small className="text-danger">{durationError}</small>}
                                                </div>

                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div style={{ marginTop: 17 }}>
                                                    <img width={150} src={sampleImage} alt="" />
                                                </div>
                                                <div className="form-group">
                                                    <label className=" form-control-label">Assessment Image <span className="text-danger">*</span> </label>
                                                    <input type="file" accept="image/*" id="file-input" name="file-input" className="form-control-file" onChange={changeSampleImage} />
                                                    {image ? null : <small className="text-danger">{imageError}</small>}
                                                </div>

                                                <div className="form-group form-check">
                                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" name="isActive" onChange={event => setcheckbox(event.target.checked)} />
                                                    <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                                                </div>
                                            </div>



                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-primary">{btn}</button>
                                                    <Link href="/exams">
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
    var { req, res } = ctx
    var { token } = parseCookies(ctx)
    try {
        if (token) {
            const { url } = absoluteUrl(req);
            const [lessonRes] = await Promise.all([
                fetch(`${url}/api/unmappedLessons`, {
                    headers: {
                        'Authorization': token,
                    },
                }),
            ]);
            const [lessons] = await Promise.all([
                lessonRes.json()

            ]);
            return { props: { lessons } };
        } else {
            return { props: {} };
        }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }
}

