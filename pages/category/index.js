import Navbar from "../Navbar"
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import { parseCookies } from 'nookies'
import $ from "jquery";

import { absoluteUrl } from "../../components/getAbsoluteUrl";
import * as bootstrapValidate from 'bootstrap-validate';

export default function addcategory(props) {

    const [nameError, setnameError] = useState()
    const [languageError, setlanguageError] = useState()
    const [category, setcategory] = useState({
        name: "",
        languages: "",
    });
    const [btn, setbtn] = useState("Submit")
    const [checkbox, setcheckbox] = useState(false)

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

    const { languages } = props;
    var createdBy;
    { islogged ? createdBy = logindata.userdata._id : null }

    var token = logindata.token
    
    let optionlanguages = languages.map(language => {
        return (
            <option key={language._id} value={language._id}>{language.languageName}</option>
        );
    });

    function isValid() {
        if (category.name == "") {
            setnameError("Please fill this required field !")
        } else {
            setnameError("")
        }
        if (category.languages == "") {
            setlanguageError(" Please fill this required field !")
        } else {
            setlanguageError("")
        }
        if (category.name == "" || category.languages == "") {
            return false
        } else {
            return true
        }
    }

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setcategory({ ...category, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isValid()) {
            setbtn("Wait...")
            const res = await fetch(`/api/categoryapi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({
                    isActive: checkbox,
                    categoryName: category.name,
                    languageId: category.languages,
                    createdBy: createdBy
                })
            })
            { res.status === 201 ? toast.success('Submitted Successfully') : toast.error('Not Submitted !') }
            setbtn("Submit")
            setcategory({ name: "", languages: "" })
        }

    }
    return (
        <>
            <Head>
                <title>Add Category</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            {islogged ?
                <div className="page-wrapper">
                    <Navbar />
                    <div className="page-content">
                        <section className="welcome p-t-10">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="title-4">
                                            Add Category
                                    </h1>
                                        <hr className="line-seprate" />
                                    </div>
                                </div>
                            </div>
                        </section>
                        <div className="main-content">
                            <div className="section__content section__content--p30">
                                <div className="container">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="form-group">
                                                    <label className="form-label">Category Name <span className="text-danger">*</span> </label>
                                                    <input type="text" className="form-control" name="name" id="name" value={category.name} onChange={handleInput} />
                                                    { category.name ? null : <small className="text-danger">{nameError}</small> }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <label className="form-label">Language <span className="text-danger">*</span> </label>

                                                <select className="form-control" name="languages" value={category.languages} onChange={handleInput} tabIndex="-98">
                                                    <option key={0} value="">Select Language</option>
                                                    {optionlanguages}
                                                </select>
                                                { category.languages ? null : <small className="text-danger">{languageError}</small> }
                                                <div className="row" style={{ marginTop: 13 }}>
                                                    <div className="col-lg-6 col-md-6 col-sm-12">
                                                        <div className="form-group form-check">
                                                            <input type="checkbox" className="form-check-input" id="exampleCheck1" name="isActive" onChange={event => setcheckbox(event.target.checked)} defaultChecked={checkbox} />
                                                            <label className="form-check-label" htmlFor="exampleCheck1">Active</label>
                                                        </div>
                                                    </div>
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
    var { req, res} = ctx
    var { token } = parseCookies(ctx)
    try {
        if (token) {
        const { url } = absoluteUrl(req);
        const res = await fetch(`${url}/api/language`, {
            headers: {
              'Authorization': token,
            }
          })
        const data = await res.json()

        return {
            props: {
                languages: data.languages
            }
        }
    }else{
        return { props: {} };
    }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }

}
