import Navbar from "../Navbar"
import React, { useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { apiURL, lessonType, vimeoURL } from "../../components/global";
import { absoluteUrl } from "../../components/getAbsoluteUrl";
import ErrorPage from 'next/error';
import { parseCookies } from 'nookies'
import $ from "jquery";

export default function lesson(props) {
    const { courses } = props;

    const [nameError, setnameError] = useState()
    const [detailError, setdetailError] = useState()
    const [courseError, setcourseError] = useState()
    const [durationError, setdurationError] = useState()
    const [typeError, settypeError] = useState()
    const [imageError, setimageError] = useState()
    const [videoError, setvideoError] = useState()
    const [textError, settextError] = useState()
    const [image, setImage] = useState()
    const [btn, setbtn] = useState("Submit")
    const [userInput, setuserInput] = useState({
        lesson_name: "",
        lesson_details: "",
        course: "",
        textfield: "",
        video_link: "",
        duration: "",
        lesson_no: "",

    })

    const [type, settype] = useState("")
    const [textfield, setTextfield] = useState("")
    const [checkbox, setcheckbox] = useState(false)
    const [filename, setfilename] = useState()
    const [sampleImage, setsampleImage] = useState()


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

    var courseList = courses.map(course => {
        return (
            <option key={course._id} value={course._id}>{course.courseName}</option>
        )
    })

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

    var words = userInput.lesson_details
    var count = 0;
    var i;
    var split = words.split(' ');
    for (i = 0; i < split.length; i++) {
        if (split[i] != "") {
            count += 1;
        }
    }

    const handletype = (event) => {

        // { event.target.value == 2 ? setTextfield("") : null }
        settype(event.target.value)
        setTextfield('')
        setfilename()
    }

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setuserInput({ ...userInput, [name]: value })

        if (userInput.lesson_details != "") {
            setdetailError("")
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
        if (userInput.lesson_name == "") {
            isValid = false
            setnameError("Please fill this required field !")
        } else {
            setnameError("")
        }
        if (userInput.lesson_details == "") {
            isValid = false
            setdetailError(" Please fill this required field !")
        } else if (count < 300 || count > 3000) {
            isValid = false
            setdetailError(" Please enter content between 300 to 3000 words !")
        }
        else {
            setdetailError("")
        }
        if (userInput.course == "") {
            isValid = false
            setcourseError(" Please fill this required field !")
        } else {
            setcourseError("")
        }
        if (userInput.duration == "") {
            isValid = false
            setdurationError(" Please fill this required field !")
        } else {
            setdurationError("")
        }
        if (type == "") {
            isValid = false
            settypeError(" Please select this required field !")
        }
        else {
            settypeError("")
        }
        if (type == lessonType.text && textfield == "") {
            isValid = false
            settextError("* Please fill this field !")
        } else {
            settextError("")
        }
        if (type == lessonType.video && (filename == undefined || filename == null || filename == "")) {
            isValid = false
            setvideoError(" * Please upload an Video file !")
        }
        else {
            setvideoError("")
        }

        if (image == "" || image == undefined) {
            isValid = false
            setimageError(" * Please upload an Image !")
        } else {
            setimageError("")
        }
        return isValid
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isValid()) {
            setbtn("Wait...")
            const mediaUrl = await uploadPhoto()
            if (filename) {
                //Video part
                var formdata = new FormData();
                formdata.append("vimeo", filename);
                var requestOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                    },
                    body: formdata,
                    redirect: 'follow'
                };
                const response = await fetch("/api/vimeo", requestOptions)
                const responseText = await response.text()
                const videoCode = responseText.split('/').pop();
                const videoURL = `${vimeoURL}${videoCode}`


                // var newRecord = { ...userInput }
                // console.log("Submitted data", newRecord);
                const res = await fetch(`/api/lessonapi`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        isActive: checkbox,
                        lessonName: userInput.lesson_name,
                        courseId: userInput.course,
                        detail: userInput.lesson_details,
                        duration: userInput.duration,
                        typeid: type,
                        lessonDetails: textfield,
                        lessonVideo: videoURL,
                        image: mediaUrl,
                        createdBy: userID

                    })
                })

                console.log("res.status", res.status);
                { res.status === 201 ? toast.success('Submitted Successfully') : toast.error('Not Submitted !', { position: "top-center", autoClose: 2000, }) }
            }
            else {
                //

                const res = await fetch(`/api/lessonapi`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        isActive: checkbox,
                        lessonName: userInput.lesson_name,
                        courseId: userInput.course,
                        detail: userInput.lesson_details,
                        duration: userInput.duration,
                        typeid: type,
                        lessonDetails: textfield,
                        image: mediaUrl,
                        createdBy: userID
                    })
                })

                console.log("res.status", res.status);
                { res.status === 201 ? toast.success('Submitted Successfully') : toast.error('Not Submitted !', { position: "top-center", autoClose: 2000, }) }


            }


            setbtn("Submit")
            setuserInput({
                lesson_name: "",
                lesson_no: "",
                lesson_details: "",
                course: "",
                video_link: "",
                duration: "",
                lessonDetails: "",

            })
            setcheckbox(false)
            setImage(null)
            setfilename(null)
            setsampleImage('')
            setTextfield('')
        }
    }

    return (
        <>
            <Head>
                <title>Add Lesson</title>
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
                                            Add Lesson
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
                                                    <label className="form-label">Lesson Name <span className="text-danger">*</span> </label>
                                                    <input type="text" className="form-control" name="lesson_name" value={userInput.lesson_name} onChange={handleInput} />
                                                    {userInput.lesson_name ? null : <small className="text-danger">{nameError}</small>}
                                                </div>
                                            </div>

                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Lesson Details <span className="text-danger">*</span> </label>
                                                    <textarea className="form-control" rows="5" name="lesson_details" value={userInput.lesson_details} onChange={handleInput} />
                                                    <small className="text-danger">{detailError} </small><span className="text-muted" style={{ float: 'right' }}> Words : {count}</span>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Course <span className="text-danger">*</span> </label>

                                                    <select className="form-control" name="course" value={userInput.course} onChange={handleInput} tabIndex="-98" >
                                                        <option key={0} value="" >Select Course</option>
                                                        {courseList}
                                                    </select>
                                                    {userInput.course ? null : <small className="text-danger">{courseError}</small>}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label className="form-label">Type <span className="text-danger">*</span> </label>
                                                <select className="form-control" name="type" value={type} onChange={event => handletype(event)} tabIndex="-98" >
                                                    <option key={0} value="">Select Type</option>
                                                    <option value={lessonType.text}>Text</option>
                                                    <option value={lessonType.video}>Video</option>

                                                </select>
                                                {type ? null : <small className="text-danger">{typeError}</small>}
                                            </div>

                                            {type == lessonType.video ?
                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                    <div className="form-group">
                                                        <label className="form-label">Upload Video <span className="text-danger">*</span> </label><br />
                                                        <input type="file" accept="video/*" onChange={(e) => setfilename(e.target.files[0])} />
                                                        <br />
                                                        {filename ? null : <small className="text-danger">{videoError}</small>}
                                                    </div>
                                                </div>
                                                : null}

                                            {type == lessonType.text ?
                                                <div className="col-lg-12 col-md-12 col-sm-12">
                                                    <div className="form-group">
                                                        <label className="form-label">Text <span className="text-danger">*</span> </label>
                                                        <textarea type="text" rows="5" className="form-control" name="textfield" value={textfield} onChange={(e) => setTextfield(e.target.value)} />
                                                        {textfield ? null : <small className="text-danger">{textError}</small>}
                                                    </div>
                                                </div>
                                                : null}


                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Lesson Duration (In minutes) <span className="text-danger">*</span> </label>
                                                    <input type="number" className="form-control" name="duration" value={userInput.duration} onChange={handleInput} />
                                                    {userInput.duration ? null : <small className="text-danger">{durationError}</small>}
                                                </div>
                                                <div style={{ marginTop: 17 }}>
                                                    <img width={150} src={sampleImage} alt="" />
                                                </div>
                                                <div className="form-group">
                                                    <label className=" form-control-label">Lesson Image <span className="text-danger">*</span> </label>
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

                                                    <Link href="/lessons">
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
            const res = await fetch(`${url}/api/courseapi`, {
                headers: {
                    'Authorization': token,
                },
            })
            const data = await res.json()
            return {
                props: {
                    courses: data.course
                }
            }
        } else {
            return { props: {} }
        }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} }
    }
}



