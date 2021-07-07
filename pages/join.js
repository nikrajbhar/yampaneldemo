import React, { useState } from 'react';
import { useRouter } from 'next/router'
import { useSelector } from "react-redux";
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head';
import { userType } from "../components/global";

export default function join() {
    const router = useRouter();
    const logindata = useSelector((state) => state.user);
    var islogged = logindata.islogged;
    if (islogged) {
        router.replace("/");
    }
    const [btn, setbtn] = useState('JOIN');
    const [userRegistration, setuserRegistration] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setuserRegistration({ ...userRegistration, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setbtn('Wait...');
        let user = {
            firstName: userRegistration.firstName,
            lastName: userRegistration.lastName,
            email: userRegistration.email,
            password: userRegistration.password,
            userType: userType.teacher,
        }
        let response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (response.status >= 200 && response.status < 300) {
            let rsp = await response.json();
            setbtn('JOIN');
            if (rsp.success) {
                router.replace('/login');
                toast.success(rsp.message, { position: "top-center" });
            } else {
                toast.warning(rsp.message, { position: "top-center" });
            }
        } else {
            setbtn('JOIN');
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
                <title>Join</title>
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
                                        <h2>Join Yam</h2>
                                    </div>
                                    <div className="login-form">
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label>First name</label>
                                                <input className="au-input au-input--full" type="text" name="firstName" placeholder="First name" value={userRegistration.firstName} onChange={handleInput} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Last name</label>
                                                <input className="au-input au-input--full" type="text" name="lastName" placeholder="Last name" value={userRegistration.lastName} onChange={handleInput} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Email Address</label>
                                                <input className="au-input au-input--full" type="email" name="email" placeholder="Email" value={userRegistration.email} onChange={handleInput} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input className="au-input au-input--full" type="password" name="password" placeholder="Password" value={userRegistration.password} onChange={handleInput} minLength="5" required />
                                            </div>
                                            <button type="submit" className="au-btn au-btn--block au-btn--green m-b-20 text-center">{btn}</button>
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
            <ToastContainer />
        </>
    );
}

