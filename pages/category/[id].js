import Navbar from "../Navbar"
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";
import { absoluteUrl } from "../../components/getAbsoluteUrl";
import ErrorPage from 'next/error';
import { parseCookies } from 'nookies'
import Moment from 'moment';
import $ from "jquery";

export default function editcategory(props) {
    const { newcategory, languages } = props;

    var precategoryName = newcategory.categoryName
    var languageId = newcategory.languageId

    const [category, setcategory] = useState({
        name: precategoryName,
        languages: languageId,
    });
    const [nameError, setnameError] = useState()
    const [languageError, setlanguageError] = useState()

    const [btn, setbtn] = useState("Submit")
    const [checkbox, setcheckbox] = useState(newcategory.isActive)

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

    var get_languages = languages.languages
    let optionlanguages = get_languages.map(get_language => {
        return (
            <option key={get_language._id} value={get_language._id}>{get_language.languageName}</option>
        )
    });

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setcategory({ ...category, [name]: value })
    }

    function isValid() {
        let isValid = true
        if (category.name == "") {
            isValid = false
            setnameError("Please fill this required field !")
        } else {
            setnameError("")
        }
        if (category.languages == "") {
            isValid = false
            setlanguageError("Please select this required field !")
        } else {
            setlanguageError("")
        }
        return isValid
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isValid()) {
            setbtn("Wait...")

            //dynamic data
            var new_categoryName = category.name
            var new_languageID = category.languages

            const res = await fetch(`/api/categoryapi`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    _id: newcategory._id,
                    isActive: checkbox,
                    categoryName: new_categoryName,
                    languageId: new_languageID,
                    updateBy: userID,
                    updateDate: Date.now()

                })
            })
            if (res.status == 201) {
                toast.success('Edited Successfully');
                router.push('/categories');
            } else {
                toast.error('Not Submitted');
            }
            setbtn("Submit");
        }
    }

    return (
        <>
            <Head>
                <title>Edit Category</title>
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
                                            Edit Category
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
                                    <form onSubmit={handleSubmit} >
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Category Name <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-control" name="name" value={category.name} onChange={handleInput} />
                                                    {category.name ? null : <small className="text-danger">{nameError}</small>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label className="form-label">Language <span className="text-danger">*</span></label>
                                                <select className="form-control" name="languages" value={category.languages} onChange={handleInput} tabIndex="-98" >
                                                    <option key={0} value="" >Select Language</option>
                                                    {optionlanguages}
                                                </select>
                                                {category.languages ? null : <small className="text-danger">{languageError}</small>}
                                            </div>
                                        </div>

                                        <div className="row" style={{ marginTop: 13 }}>
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group form-check">
                                                    <input type="checkbox" className="form-check-input" id="exampleCheck1" name="isActive" onChange={event => setcheckbox(event.target.checked)} defaultChecked={checkbox} />
                                                    <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row" style={{ marginTop: 10 }}>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-primary">{btn}</button>

                                                    <Link href="/categories">
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
        const [newcategoryRes, languagesRes] = await Promise.all([
            fetch(`${url}/api/category/${id}`, {
                headers: {
                  'Authorization': token,
                }
              }),
            fetch(`${url}/api/language`, {
                headers: {
                  'Authorization': token,
                },
              })
        ]);
        const [newcategory, languages] = await Promise.all([
            newcategoryRes.json(),
            languagesRes.json()
        ]);
        return { props: { newcategory, languages } };
    }else{
        return { props: {} };
    }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }
}






