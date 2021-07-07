import Navbar from "../Navbar"
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head'
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiURL, userType } from "../../components/global"
import { absoluteUrl } from "../../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from 'jquery';

export default function editcourse(props) {


    const { newcourse, languages, category, teacher } = props;

    const [newmedia, setnewMedia] = useState(newcourse.image) //fetch from DB
    const [media, setMedia] = useState() // new image

    const [course, setcourse] = useState({
        course_name: newcourse.courseName,
        course_details: newcourse.detail,
        course_duration: newcourse.duration,
        category: newcourse.categoryId,
        prerequirments: newcourse.prerequirments,
        teacher: newcourse.teacherId,
        languages: newcourse.languageId,
        course_code: newcourse.courseCode,
        image: newmedia,
    })


    const [btn, setbtn] = useState("Submit")
    const [checkbox, setcheckbox] = useState(newcourse.isActive)

    const [courseError, setcourseError] = useState()
    const [codeError, setcodeError] = useState()
    const [detailError, setdetailError] = useState()
    const [durationError, setdurationError] = useState()
    const [languageError, setlanguageError] = useState()
    const [categoryError, setcategoryError] = useState()
    const [teacherError, setteacherError] = useState()
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

    var token = logindata.token

    var _id = newcourse._id;

    let optionlanguages = languages.languages.map(language => {
        return (
            <option key={language._id} value={language._id}>{language.languageName}</option>
        )
    });

    let optionteacher = teacher.users.map(user => {
        return (
            <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
        )
    });

    const uploadPhoto = async (e) => {
        const file = media;
        const data = new FormData();
        data.append('image_data', JSON.stringify({ imageUrl: newmedia, isProfile: false }));
        data.append('image', file);
        const res = await fetch(`${apiURL}/api/image/upload`, {
            method: "POST",
            headers: {
                'Authorization': token,
            },
            body: data
        })
        // console.log("RES: ", res);
        let finalResponse = await res.json();
        // console.log("final ", finalResponse.imageUrl);
        return finalResponse.imageUrl
    }

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setcourse({ ...course, [name]: value })
    }

    const newCategorys = category.categories.filter(function (ele) {
        return ele.languageId._id == course.languages //filter according to the selection
    })

    let optionCategory = newCategorys.map(categorie => {
        return (
            <option key={categorie._id} value={categorie._id}>{categorie.categoryName}</option>
        )
    }
    );

    function isValid() {
        let isValid = true
        if (course.course_name == "") {
            isValid = false
            setcourseError("Please fill this required field !")
        } else {
            setcourseError("")
        }
        if (course.category == "" || course.category == null || course.category == undefined) {
            isValid = false

            setcategoryError(" Please select this required field !")
        } else {

            setcategoryError("")
        }
        if (course.course_details == "") {
            isValid = false
            setdetailError("Please fill this required field !")
        } else {
            setdetailError("")
        }
        if (course.teacher == "") {
            isValid = false
            setteacherError(" Please select this required field !")
        } else {
            setteacherError("")
        }
        if (course.course_duration == "") {
            isValid = false
            setdurationError("Please fill this required field !")
        } else {
            setdurationError("")
        }
        if (course.languages == "") {
            isValid = false
            setlanguageError(" Please select this required field !")
        } else {
            setlanguageError("")
        }
        if (course.course_code == "") {
            isValid = false
            setcodeError(" Please fill this required field !")
        } else {
            setcodeError("")
        }

        return isValid

    }

    const changeSampleImage = (e) => {
        var binaryData = [];
        binaryData.push(e.target.files[0]);
        setsampleImage(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })))
        setMedia(e.target.files[0])
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isValid()) {
            setbtn("Wait...")
            const data = {
                _id: _id,
                isActive: checkbox,
                courseName: course.course_name,
                courseCode: course.course_code,
                categoryId: course.category,
                detail: course.course_details,
                teacherId: course.teacher,
                duration: course.course_duration,
                prerequirments: course.prerequirments,
                createdBy: userID,
                image: course.image,
                languageId: course.languages,
                updateBy: userID,
                updateDate: Date.now()
            }


            if (!media) {

                const res = await fetch(`/api/courseapi`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify(data)
                })

                console.log("res.status", res.status);
                { res.status == 201 ? toast.success('Edited Successfully') : toast.error('Not Submitted') }
                { res.status == 201 ? router.push('/courses') : toast.error('Not Submitted') }
            }
            else {

                const mediaUrl = await uploadPhoto()
                const res = await fetch(`/api/courseapi`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        _id: _id,
                        isActive: checkbox,
                        courseName: course.course_name,
                        courseCode: course.course_code,
                        categoryId: course.category,
                        detail: course.course_details,
                        teacherId: course.teacher,
                        duration: course.course_duration,
                        prerequirments: course.prerequirments,
                        image: mediaUrl,
                        languageId: course.languages,
                        updateBy: userID,
                        updateDate: Date.now()
                    })
                })

                console.log("res.status", res.status);
                { res.status == 201 ? toast.success('Edited Successfully') : toast.error('Not Submitted') }
                { res.status == 201 ? router.push('/courses') : toast.error('Not Submitted') }

            }
            setbtn("Submit")



        }
    }


    return (
        <>
            <Head>
                <title>Edit Course</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {islogged ?

                <div className="page-wrapper">

                    {/* <!-- HEADER DESKTOP--> */}
                    <Navbar />

                    {/* <!-- END HEADER MOBILE -->

                <!-- PAGE CONTENT--> */}

                    <div className="page-content">

                        {/* <!-- WELCOME--> */}

                        <section className="welcome p-t-10">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="title-4">
                                            Edit Course
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
                                                    <label className="form-label">Course Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="course_name" value={course.course_name} onChange={handleInput} />
                                                    {course.course_name ? null : <small className="text-danger">{courseError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Course Code <span className="text-danger">*</span> </label>
                                                    <input type="text" className="form-control" name="course_code" value={course.course_code} onChange={handleInput} />
                                                    {course.course_code ? null : <small className="text-danger">{codeError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Course Details <span className="text-danger">*</span> </label>
                                                    <textarea className="form-control" rows="5" name="course_details" value={course.course_details} onChange={handleInput} />
                                                    {course.course_details ? null : <small className="text-danger">{detailError}</small>}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Course Duration (In minutes) <span className="text-danger">*</span> </label>
                                                    <input type="number" className="form-control" name="course_duration" value={course.course_duration} onChange={handleInput} />
                                                    {course.course_duration ? null : <small className="text-danger">{durationError}</small>}
                                                </div>
                                            </div>



                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Prerequisite </label>
                                                    <input type="text" className="form-control" name="prerequirments" value={course.prerequirments} onChange={handleInput} />
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label className="form-label">Language <span className="text-danger">*</span> </label>

                                                <select className="form-control" name="languages" value={course.languages} onChange={handleInput} tabIndex="-98">
                                                    <option key={0} value="">Select Language</option>
                                                    {optionlanguages}
                                                </select>
                                                {course.languages ? null : <small className="text-danger">{languageError}</small>}
                                            </div>


                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label className="form-label">Category <span className="text-danger">*</span> </label>
                                                <select className="form-control" name="category" value={course.category} onChange={handleInput} tabIndex="-98"  >
                                                    <option key={0} value="">Select Category</option>
                                                    {optionCategory}
                                                </select>
                                                {course.category ? null : <small className="text-danger">{categoryError}</small>}
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12" style={{ marginTop: 10 }}>
                                                <label className="form-label">Teacher <span className="text-danger">*</span> </label>

                                                <select className="form-control" name="teacher" value={course.teacher} onChange={handleInput} tabIndex="-98"  >
                                                    <option key={0} value="">Select Teacher</option>
                                                    {optionteacher}

                                                </select>
                                                {course.teacher ? null : <small className="text-danger">{teacherError}</small>}
                                                {/* <div style={{ marginTop: 17 }}>
                                                    <img width={150} src={sampleImage} alt="" />
                                                </div> */}
                                                <div style={{ marginTop: 17 }}>
                                                    {sampleImage ? <img width={150} src={sampleImage} alt="" /> : <img width={150} src={newmedia} alt="" />}
                                                </div>
                                                <div className="form-group">
                                                    <label className=" form-control-label" >Course Image <span className="text-danger">*</span> </label>
                                                    <input type="file" accept="image/*" id="file-input" name="file-input" className="form-control-file" onChange={changeSampleImage} />
                                                    {/* onChange={(e) => setMedia(e.target.files[0])} */}
                                                </div>

                                                <div className="form-group form-check">
                                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" name="isActive" onChange={event => setcheckbox(event.target.checked)} defaultChecked={checkbox} />
                                                    <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                                                </div>
                                            </div>


                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-primary">{btn}</button>

                                                    <Link href="/courses" >
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
            const [newcourseRes, categoryRes, languagesRes, userRes] = await Promise.all([
                fetch(`${url}/api/course/${id}`, {
                    headers: {
                        'Authorization': token,
                    }
                }),
                fetch(`${url}/api/categoryapi/`, {
                    headers: {
                        'Authorization': token,
                    }
                }),
                fetch(`${url}/api/language`, {
                    headers: {
                        'Authorization': token,
                    }
                }),
                fetch(`${url}/api/userapi?usertype=${userType.teacher}&&isActive=true`, {
                    headers: {
                        'Authorization': token,
                    }
                }),
            ]);
            const [newcourse, category, languages, teacher] = await Promise.all([
                newcourseRes.json(),
                categoryRes.json(),
                languagesRes.json(),
                userRes.json()
            ]);
            return { props: { newcourse, category, languages, teacher } };
        }else{
            return { props: {} };
        }
        } catch (error) {
            res.statusCode = 404;
            return { props: {} };
        }
    }