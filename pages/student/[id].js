import Head from 'next/head'
import Navbar from "../Navbar"
import Link from 'next/link';
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiURL, gender } from "../../components/global"
import Moment from 'moment';
import { absoluteUrl } from "../../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from 'jquery';

export default function student(props) {

    const { student } = props;

    const [firstNameError, setfirstNameError] = useState()
    const [lastNameError, setlastNameError] = useState()
    const [emailError, setemailError] = useState()
    const [rollnoError, setrollnoError] = useState()
    const [classError, setclassError] = useState()
    const [genderError, setgenderError] = useState()
    const [numberError, setnumberError] = useState()
    const [parents_nameError, setparents_nameError] = useState()
    const [parents_numberError, setparents_numberError] = useState()
    const [date_of_birthError, setdate_of_birthError] = useState()
    const [blood_groupError, setblood_groupError] = useState()
    const [addressError, setaddressError] = useState()
    const [profileImageError, setprofileImageError] = useState()

    const [sampleImage, setsampleImage] = useState()
    const [media, setMedia] = useState()

    var date
    { student.dob ? date = Moment(student.dob).format("YYYY-MM-DD") : null }

    const [btn, setbtn] = useState("Submit")
    const [studentRegistration, setstudentRegistration] = useState({
        isActive: checkbox,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        rollno: student.rollno,
        class: student.studentclass,
        gender: student.gender,
        number: student.mobileNo,
        parents_name: student.parentsName,
        parents_number: student.parentsnumber,
        date_of_birth: date,
        blood_group: student.bloodgroup,
        address: student.address,
    })
    const [premedia, setpreMedia] = useState(student.profileImage) //fetch from DB
    const [checkbox, setcheckbox] = useState(student.isActive)
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

    var token = logindata.token
    var userID;
    { islogged ? userID = logindata.userdata._id : null }

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

        let finalResponse = await res.json();

        return finalResponse.imageUrl
    }


    function isValid() {
        let isValid = true
        if (studentRegistration.firstName == "" || studentRegistration.firstName == null || studentRegistration.firstName == undefined) {
            isValid = false
            setfirstNameError("Please fill this required field!")
        } else {
            setfirstNameError("")
        }
        if (studentRegistration.lastName == "" || studentRegistration.lastName == null || studentRegistration.lastName == undefined) {
            isValid = false
            setlastNameError(" Please fill this required field!")
        } else {
            setlastNameError("")
        }
        if (studentRegistration.email == "" || studentRegistration.email == null || studentRegistration.email == undefined) {
            isValid = false
            setemailError("Please fill this required field!")
        } else {
            setemailError("")
        }
        if (studentRegistration.rollno == "" || studentRegistration.rollno == null || studentRegistration.rollno == undefined) {
            isValid = false
            setrollnoError("Please fill this required field!")
        } else {
            setrollnoError("")
        }
        if (studentRegistration.class == "" || studentRegistration.class == null || studentRegistration.class == undefined) {
            isValid = false
            setclassError("Please fill this required field!")
        } else {
            setclassError("")
        }
        if (studentRegistration.gender == "" || studentRegistration.gender == null || studentRegistration.gender == undefined) {
            isValid = false
            setgenderError("Please fill this required field!")
        } else {
            setgenderError("")
        }
        if (studentRegistration.number == "" || studentRegistration.number == null || studentRegistration.number == undefined) {
            isValid = false
            setnumberError("Please fill this required field!")
        } else {
            setnumberError("")
        }
        if (studentRegistration.parents_name == "" || studentRegistration.parents_name == null || studentRegistration.parents_name == undefined) {
            isValid = false
            setparents_nameError("Please fill this required field!")
        } else {
            setparents_nameError("")
        }
        if (studentRegistration.parents_number == "" || studentRegistration.parents_number == null || studentRegistration.parents_number == undefined) {
            isValid = false
            setparents_numberError("Please fill this required field!")
        } else {
            setparents_numberError("")
        }
        if (studentRegistration.date_of_birth == "" || studentRegistration.date_of_birth == null || studentRegistration.date_of_birth == undefined) {
            isValid = false
            setdate_of_birthError("Please fill this required field!")
        } else {
            setdate_of_birthError("")
        }
        if (studentRegistration.blood_group == "" || studentRegistration.blood_group == null || studentRegistration.blood_group == undefined) {
            isValid = false
            setblood_groupError("Please fill this required field!")
        } else {
            setblood_groupError("")
        }
        if (studentRegistration.address == "" || studentRegistration.address == null || studentRegistration.address == undefined) {
            isValid = false
            setaddressError("Please fill this required field!")
        } else {
            setaddressError("")
        }
        if (media == undefined && (student.profileImage == "" || student.profileImage == undefined || student.profileImage == null)) {
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
        setstudentRegistration({ ...studentRegistration, [name]: value })
    }

    const changeSampleImage = (e) => {
        var binaryData = [];
        binaryData.push(e.target.files[0]);
        setsampleImage(URL.createObjectURL(new Blob(binaryData, { type: "application/json" })))
        setMedia(e.target.files[0])
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let data = {
            _id: student._id,
            isActive: checkbox,
            firstName: studentRegistration.firstName,
            lastName: studentRegistration.lastName,
            rollno: studentRegistration.rollno,
            studentclass: studentRegistration.class,
            gender: studentRegistration.gender,
            mobileNo: studentRegistration.number,
            parentsName: studentRegistration.parents_name,
            parentsnumber: studentRegistration.parents_number,
            dob: studentRegistration.date_of_birth,
            bloodgroup: studentRegistration.blood_group,
            address: studentRegistration.address,
            profileImage: student.profileImage,
            updateBy: userID,
            updateDate: Date.now()
        }


        if (isValid()) {
            setbtn("Wait...")
            // const newRecord = { ...studentRegistration }
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
                { res.status == 201 ? router.push('/students') : toast.error('Not Submitted') }
            } else {

                const mediaUrl = await uploadPhoto()
                const res = await fetch(`/api/userapi`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                    body: JSON.stringify({
                        _id: student._id,
                        isActive: checkbox,
                        firstName: studentRegistration.firstName,
                        lastName: studentRegistration.lastName,
                        rollno: studentRegistration.rollno,
                        studentclass: studentRegistration.class,
                        gender: studentRegistration.gender,
                        mobileNo: studentRegistration.number,
                        parentsName: studentRegistration.parents_name,
                        parentsnumber: studentRegistration.parents_number,
                        dob: studentRegistration.date_of_birth,
                        bloodgroup: studentRegistration.blood_group,
                        address: studentRegistration.address,
                        profileImage: mediaUrl,
                        updateBy: userID,
                        updateDate: Date.now()
                    })
                })

                console.log("res.status", res.status);
                { res.status == 201 ? toast.success('Edited Successfully') : toast.error('Not Submitted') }
                { res.status == 201 ? router.push('/students') : toast.error('Not Submitted') }
                setbtn("Submit")
            }
        }
    }


    return (
        <>
            <Head>
                <title>Edit Student</title>
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
                                            Edit Student
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
                                                    <label className="form-label">First Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="firstName" value={studentRegistration.firstName} onChange={handleInput} />
                                                    {studentRegistration.firstName ? null : <small className="text-danger">{firstNameError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Last Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="lastName" value={studentRegistration.lastName} onChange={handleInput} />
                                                    {studentRegistration.lastName ? null : <small className="text-danger">{lastNameError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Email <span className="text-danger">*</span></label>
                                                    <input type="email" className="form-control" name="email" value={studentRegistration.email} readOnly />
                                                    {studentRegistration.email ? null : <small className="text-danger">{emailError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Roll No. <span className="text-danger">*</span></label>
                                                    <input type="number" className="form-control" name="rollno" value={studentRegistration.rollno} onChange={handleInput} />
                                                    {studentRegistration.rollno ? null : <small className="text-danger">{rollnoError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Class <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="class" value={studentRegistration.class} onChange={handleInput} />
                                                    {studentRegistration.class ? null : <small className="text-danger">{classError}</small>}
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">

                                                <label className="form-label">Gender <span className="text-danger">*</span></label>

                                                <select className="form-control" name="gender" value={studentRegistration.gender} onChange={handleInput} tabIndex="-98">
                                                    <option key={0} value="">Select Gender</option>
                                                    <option value={gender.male}>Male</option>
                                                    <option value={gender.female}>Female</option>
                                                </select>
                                                {studentRegistration.gender ? null : <small className="text-danger">{genderError}</small>}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Mobile No. <span className="text-danger">*</span></label>
                                                    <input type="number" className="form-control" name="number" value={studentRegistration.number} onChange={handleInput} />
                                                    {studentRegistration.number ? null : <small className="text-danger">{numberError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Parents Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="parents_name" value={studentRegistration.parents_name} onChange={handleInput} />
                                                    {studentRegistration.parents_name ? null : <small className="text-danger">{parents_nameError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Parents Mobile No. <span className="text-danger">*</span></label>
                                                    <input type="number" className="form-control" name="parents_number" value={studentRegistration.parents_number} onChange={handleInput} />
                                                    {studentRegistration.parents_number ? null : <small className="text-danger">{parents_numberError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                                                    <input type="date" className="form-control" name="date_of_birth" value={studentRegistration.date_of_birth} onChange={handleInput} />
                                                    {studentRegistration.date_of_birth ? null : <small className="text-danger">{date_of_birthError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Blood Group <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="blood_group" value={studentRegistration.blood_group} onChange={handleInput} />
                                                    {studentRegistration.blood_group ? null : <small className="text-danger">{blood_groupError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Address <span className="text-danger">*</span></label>
                                                    <textarea className="form-control" rows="5" name="address" value={studentRegistration.address} onChange={handleInput} />
                                                    {studentRegistration.address ? null : <small className="text-danger">{addressError}</small>}
                                                </div>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <div style={{ marginBottom: 8 }}>

                                                        {sampleImage ? <img width={150} src={sampleImage} alt="" /> : <img width={150} src={premedia} alt="" />}
                                                    </div>


                                                    <label className=" form-control-label">Profile Image <span className="text-danger">*</span></label>
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

                                                    <Link href="/students">
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
            const [studentRes, userRes] = await Promise.all([
                fetch(`${url}/api/student/${id}`, {
                    headers: {
                        'Authorization': token,
                    }
                }),
                fetch(`${url}/api/userapi`, {
                    headers: {
                        'Authorization': token,
                    }
                }),
            ]);
            const [student, user] = await Promise.all([
                studentRes.json(),
                userRes.json(),

            ]);
            return { props: { student, user } };
        } else {
            return { props: {} };
        }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }

}
