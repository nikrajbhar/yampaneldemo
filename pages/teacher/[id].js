import Navbar from "../Navbar"
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { gender, apiURL } from "../../components/global";
import Moment from 'moment';
import { absoluteUrl } from "../../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from 'jquery';

export default function teacher(props) {
    const { teacher } = props;

    const [sampleImage, setsampleImage] = useState()

    const [firstNameError, setfirstNameError] = useState()
    const [lastNameError, setlastNameError] = useState()

    const [emailError, setemailError] = useState()
    const [mobileNoError, setmobileNoError] = useState()

    const [birthdateError, setbirthdateError] = useState()
    const [genderError, setgenderError] = useState()

    const [educationError, seteducationError] = useState()
    const [designationError, setdesignationError] = useState()

    const [departmentError, setdepartmentError] = useState()
    const [profileImageError, setprofileImageError] = useState()

    const [checkbox, setcheckbox] = useState(teacher.isActive)
    const [btn, setbtn] = useState("Submit")
    const [premedia, setpreMedia] = useState(teacher.profileImage)
    const [media, setMedia] = useState()

    var date
    { teacher.dob ? date = Moment(teacher.dob).format("YYYY-MM-DD") : null }

    var userID;
    { islogged ? userID = logindata.userdata._id : null }

    const [userInput, setuserInput] = useState({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        number: teacher.mobileNo,
        date_of_birth: date,
        gender: teacher.gender,
        education: teacher.education,
        designation: teacher.designation,
        department: teacher.department,
    })

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

    var _id = teacher._id;
    var token = logindata.token

    const uploadPhoto = async (e) => {
        const file = media;
        const data = new FormData();
        data.append('image_data', JSON.stringify({ imageUrl: premedia, isProfile: true }));
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





    function isValid() {
        let isValid = true
        if (userInput.firstName == "" || userInput.firstName == undefined || userInput.firstName == null) {
            isValid = false
            setfirstNameError("Please fill this required field!")
        } else {
            setfirstNameError("")
        }
        if (userInput.lastName == "" || userInput.lastName == undefined || userInput.lastName == null) {
            isValid = false
            setlastNameError(" Please fill this required field!")
        } else {
            setlastNameError("")
        }
        if (userInput.email == "" || userInput.email == undefined || userInput.email == null) {
            isValid = false
            setemailError("Please fill this required field!")
        } else {
            setemailError("")
        }
        if (userInput.number == "" || userInput.number == undefined || userInput.number == null) {
            isValid = false
            setmobileNoError("Please fill this required field!")
        } else {
            setmobileNoError("")
        }
        if (userInput.date_of_birth == "" || userInput.date_of_birth == undefined || userInput.date_of_birth == null) {
            isValid = false
            setbirthdateError("Please fill this required field!")
        } else {
            setbirthdateError("")
        }
        if (userInput.gender == "" || userInput.gender == undefined || userInput.gender == null) {
            isValid = false
            setgenderError("Please fill this required field!")
        } else {
            setgenderError("")
        }
        if (userInput.education == "" || userInput.education == undefined || userInput.education == null) {
            isValid = false
            seteducationError("Please fill this required field!")
        } else {
            seteducationError("")
        }
        if (userInput.designation == "" || userInput.designation == undefined || userInput.designation == null) {
            isValid = false
            setdesignationError("Please fill this required field!")
        } else {
            setdesignationError("")
        }
        if (media == undefined && (teacher.profileImage == "" || teacher.profileImage == undefined || teacher.profileImage == null)) {
            isValid = false
            setprofileImageError("Please fill this required field!")
        } else {
            setprofileImageError("")
        }
        return isValid

    }

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setuserInput({ ...userInput, [name]: value })
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
            setbtn('Wait...')
            const data = {
                _id: _id,
                isActive: checkbox,
                firstName: userInput.firstName,
                lastName: userInput.lastName,
                mobileNo: userInput.number,
                dob: userInput.date_of_birth,
                gender: userInput.gender,
                education: userInput.education,
                designation: userInput.designation,
                department: userInput.department,
                profileImage: teacher.profileImage,
                updateBy: userID,
                updateDate: Date.now()
            }
            // var newRecord = { ...userInput }
            // console.log("Submitted data", newRecord);

            //
            if (!media) {
                const res = await fetch(`/api/userapi`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify(data)
                })

                console.log("res.status", res.status);

                { res.status == 201 ? toast.success('Edited Successfully') : toast.error('Not Submitted') }
                { res.status == 201 ? router.push('/teachers') : toast.error('Not Submitted') }
            }
            else {

                const mediaUrl = await uploadPhoto()
                const res = await fetch(`/api/userapi`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        _id: _id,
                        isActive: checkbox,
                        firstName: userInput.firstName,
                        lastName: userInput.lastName,
                        mobileNo: userInput.number,
                        dob: userInput.date_of_birth,
                        gender: userInput.gender,
                        education: userInput.education,
                        designation: userInput.designation,
                        department: userInput.department,
                        profileImage: mediaUrl,
                        updateBy: userID,
                        updateDate: Date.now()
                    })
                })

                console.log("res.status", res.status);
                { res.status == 201 ? toast.success('Edited Successfully') : toast.error('Not Submitted') }
                { res.status == 201 ? router.push('/teachers') : toast.error('Not Submitted') }
                setbtn('Submit')
            }
            //
        }

    }

    return (
        <>
            <Head>
                <title>Edit Teacher</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {islogged ?

                <div className="page-wrapper">

                    <Navbar />

                    {/* <!-- PAGE CONTENT-->  */}
                    <div className="page-content">
                        {/* 
            <!-- WELCOME--> */}
                        <section className="welcome p-t-10">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="title-4">
                                            Edit Teacher
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
                                                    <label className="form-label">First Name  <span className="text-danger">*</span> </label>
                                                    <input type="text" className="form-control" name="firstName" value={userInput.firstName} onChange={handleInput} />
                                                    {userInput.firstName ? null : <small className="text-danger">{firstNameError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Last Name  <span className="text-danger">*</span> </label>
                                                    <input type="text" className="form-control" name="lastName" value={userInput.lastName} onChange={handleInput} />
                                                    {userInput.lastName ? null : <small className="text-danger">{lastNameError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Email <span className="text-danger">*</span> </label>
                                                    <input type="email" className="form-control" name="email" value={userInput.email} readOnly />
                                                    {userInput.email ? null : <small className="text-danger">{emailError}</small>}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Mobile Number  <span className="text-danger">*</span> </label>
                                                    <input type="text" className="form-control" name="number" value={userInput.number} onChange={handleInput} />
                                                    {userInput.number ? null : <small className="text-danger">{mobileNoError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Select Gender  <span className="text-danger">*</span> </label>
                                                    <select className="form-control" name="gender" value={userInput.gender} onChange={handleInput} tabIndex="-98">
                                                        <option key={0} value="">Gender</option>
                                                        <option value={gender.male}>Male</option>
                                                        <option value={gender.female}>Female</option>
                                                    </select>
                                                    {userInput.gender ? null : <small className="text-danger">{genderError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Designation  <span className="text-danger">*</span> </label>
                                                    <input type="text" className="form-control" name="designation" value={userInput.designation} onChange={handleInput} />
                                                    {userInput.designation ? null : <small className="text-danger">{designationError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Department  <span className="text-danger">*</span> </label>
                                                    <select className="form-control" name="department" value={userInput.department} onChange={handleInput} tabIndex="-98">
                                                        <option key={0} value=""> Department</option>
                                                        <option value="html">HTML</option>
                                                        <option value="css">CSS</option>
                                                        <option value="javascript">JavaScript</option>
                                                        <option value="angular">Angular</option>
                                                        <option value="angular">React</option>
                                                        <option value="vuejs">Vue.js</option>
                                                        <option value="ruby">Ruby</option>
                                                        <option value="php">PHP</option>
                                                        <option value="asp">ASP.NET</option>
                                                        <option value="python">Python</option>
                                                        <option value="mysql">MySQL</option>
                                                    </select>
                                                    {userInput.department ? null : <small className="text-danger">{departmentError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Date of Birth  <span className="text-danger">*</span> </label>
                                                    <input type="date" className="form-control" name="date_of_birth" value={userInput.date_of_birth} onChange={handleInput} />
                                                    {userInput.date_of_birth ? null : <small className="text-danger">{birthdateError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Education  <span className="text-danger">*</span> </label>
                                                    <input type="text" className="form-control" name="education" value={userInput.education} onChange={handleInput} />
                                                    {userInput.education ? null : <small className="text-danger">{educationError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <div style={{ marginBottom: 8 }}>
                                                        {/* {media ? null : <img width={150} src={premedia} alt="" />} */}
                                                        {sampleImage ? <img width={150} src={sampleImage} alt="" /> : <img width={150} src={premedia} alt="" />}
                                                    </div>
                                                    <label className=" form-control-label">Profile Image  <span className="text-danger">*</span> </label>
                                                    <input type="file" accept="image/*" id="file-input" name="file-input" className="form-control-file" onChange={changeSampleImage} />
                                                    <small className="text-danger">{profileImageError}</small>
                                                </div>
                                                <div className="form-group form-check">
                                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" name="isActive" onChange={event => setcheckbox(event.target.checked)} defaultChecked={checkbox} />
                                                    <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-primary">{btn}</button>
                                                    <Link href="/teachers">
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
                autoClose={5000}
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
        // Fetch data from external API
        if (token) {
            const { url } = absoluteUrl(req);
            const res = await fetch(`${url}/api/teacher/${id}`, {
                headers: {
                    'Authorization': token,
                }
            }
            )
            const data = await res.json()

            // Pass data to the page via props
            return {
                props: {
                    teacher: data
                }
            }
        } else {
            return { props: {} };
        }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }

}


