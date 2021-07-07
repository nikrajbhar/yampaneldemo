import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Head from 'next/head';
import { login_details, clearLoginData } from "../redux/actions/userAction";
import { useSelector, useDispatch } from "react-redux";
import { userType } from '../components/global';
import { useRouter } from 'next/router'

export default function login() {
    const dispatch = useDispatch();
    const [btn, setbtn] = useState('SIGN IN');
    const [login, setlogin] = useState({
        email: "",
        password: ""
    });

    const logindata = useSelector((state) => state.user);
    var islogged = logindata.islogged
    const router = useRouter();
    if (islogged) {
        router.replace('/')
    }
    
    useEffect(() => {
        var errorLogin = logindata.errorLogin;
        if (errorLogin) {
            toast.error(errorLogin, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            dispatch(clearLoginData());
            setbtn('SIGN IN');
        }
    });
    const handleInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setlogin({ ...login, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setbtn('Wait...');
        try {
            dispatch(login_details({ email: login.email, password: login.password, userType: userType.teacher }));
        } catch (error) {
            setbtn('SIGN IN');
            toast.error("Something wrong! Please try again later", { position: "top-center" });
        }
    }

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <div className="page-wrapper">
                <div className="page-content">
                    <div className="container">
                        <div className="login-wrap">
                            <img className="login-logo" alt="yam" src="images/logo.png" />
                            <div className="login-content">
                                <div className="login-logo">
                                    <h2>Login to Yam</h2>
                                </div>
                                <div className="login-form">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Email address</label>
                                            <input className="au-input au-input--full" type="email" name="email" placeholder="Email" value={login.email} onChange={handleInput} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input className="au-input au-input--full" type="password" name="password" placeholder="Password" value={login.password} onChange={handleInput} required />
                                        </div>
                                        <button type="submit" className="au-btn au-btn--block au-btn--green m-b-20 text-center">{btn}</button>
                                        <Link href="/join">
                                            <a className="m-b-20">New user? Sign up</a>
                                        </Link>
                                        <div className="login-checkbox">
                                            <label>
                                                <Link href="/forgotPassword">
                                                    <a>Forgot Password?</a>
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
            <ToastContainer autoClose={5000} />
        </>
    );
}

