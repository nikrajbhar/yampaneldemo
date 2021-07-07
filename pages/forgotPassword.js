import React, { useState } from 'react';
import axios from "axios";
import Link from 'next/link';
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";

export default function forget_pass() {
    const router = useRouter();
    const logindata = useSelector((state) => state.user);
    var islogged = logindata.islogged;
    if (islogged) {
        router.replace("/")
    }
    const [btn, setbtn] = useState('SUBMIT');
    const [userForgot, setuserForgot] = useState({
        email: "",
    });

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setuserForgot({ ...userForgot, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setbtn('Wait...');
        let response = await fetch('/api/auth/forgotPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userForgot.email,
            })
        });
        if (response.status >= 200 && response.status < 300) {
            let rsp = await response.json();
            setbtn('SUBMIT');
            if (rsp.success) {
                router.replace('/login');
                toast.success(rsp.message, { position: "top-center" });
            } else {
                toast.warning(rsp.message, { position: "top-center" });
            }
        } else {
            setbtn('SUBMIT');
            toast.error("Something wrong! Please try again.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }
    return (
        <>
            <Head>
                <title>Forgot Password</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            {!islogged ?
                <div className="page-wrapper">
                    <div className="page-content">
                        <div className="container">
                            <div className="login-wrap">
                                <img className="login-logo" alt="yam" src="images/logo.png" />
                                <div className="login-content">
                                    <div className="login-logo">
                                        <h2>Forgot Password</h2>
                                    </div>
                                    <div className="login-form">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label>Email Address</label>
                                                <input className="au-input au-input--full" type="email" name="email" placeholder="Email" value={userForgot.email} onChange={handleInput} required />
                                            </div>
                                            <button className="au-btn au-btn--block au-btn--green m-b-20" type="submit">{btn}</button>
                                            <div className="login-checkbox">
                                                <label>
                                                    <Link href="/login">
                                                        <a>Login</a>
                                                    </Link>
                                                </label>
                                            </div>
                                        </form>
                                    </div>
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

