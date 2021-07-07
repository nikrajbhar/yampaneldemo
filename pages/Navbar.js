import Link from 'next/link'
import { useDispatch } from "react-redux";
import { clearLoginData } from "../redux/actions/userAction";
import { useSelector } from "react-redux";

export default function Navbar() {

    const dispatch = useDispatch();
    const logindata = useSelector((state) => state.user);
    console.log(logindata.userdata.firstName);
    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(clearLoginData())
    }

    const toggleAdmin = (e) => {
        e.preventDefault();
        var element = document.getElementById("myDIV");
        element.classList.toggle("show-dropdown");
    }

    const toggleMobile = (e) => {
        e.preventDefault();
        var element = document.getElementById("myDIV1");
        element.classList.toggle("is-active");
        var elem = document.getElementsByClassName("navbar-mobile");
        if (elem[0].style.display === 'block') {
            elem[0].style.display = 'none';
        } else {
            elem[0].style.display = 'block';
        }
    }
    return (
        <>
            <header className="header-desktop3 d-none d-lg-block">
                <div className="section__content section__content--p35">
                    <div className="header3-wrap">
                        <div className="header__logo">

                            <Link href="/">
                                <a>Yam</a>
                            </Link>
                        </div>
                        <div className="header__navbar">
                            <ul className="list-unstyled">
                                <li>
                                    <Link href="/">
                                        <a>
                                            <i className="fas fa-tachometer-alt"></i>
                                            <span className="bot-line"></span>Dashboard
                                        </a>
                                    </Link>
                                </li>
                                <li className="has-sub">
                                    <Link href="/students">
                                        <a>
                                            <i className="fas fa-user"></i>Students
                                            <span className="bot-line"></span>
                                        </a>
                                    </Link>

                                    {/* <ul className="header3-sub-list list-unstyled">
                                        <li>
                                            <Link href="/students">
                                                <a>Students list</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/student">
                                                <a>Add Student</a>
                                            </Link>
                                        </li>

                                    </ul> */}
                                </li>
                                <li className="has-sub">
                                    <Link href="/teachers">
                                        <a href="#">
                                            <i className="fas fa-users"></i>Teachers
                                            <span className="bot-line"></span>
                                        </a>
                                    </Link>
                                    {/* <ul className="header3-sub-list list-unstyled">
                                        <li>
                                            <Link href="/teachers">
                                                <a>Teachers list</a>
                                            </Link>

                                        </li>
                                        <li>
                                            <Link href="/teacher">
                                                <a>Add Teacher</a>
                                            </Link>

                                        </li>

                                    </ul> */}
                                </li>
                                <li className="has-sub">
                                    <a href="#">
                                        <i className="fas  fa-th-large"></i>e-Learning
                                        <span className="bot-line"></span>
                                    </a>
                                    <ul className="header3-sub-list list-unstyled">

                                        <li>
                                            <Link href="/courses">
                                                <a>Courses</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/lessons">
                                                <a>Lessons</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/exams">
                                                <a>Assessments</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/questions">
                                                <a>Questions</a>
                                            </Link>
                                        </li>

                                        <li>
                                            <Link href="/categories">
                                                <a>Categories</a>
                                            </Link>

                                        </li>

                                    </ul>
                                </li>

                                <li className="has-sub">
                                    <a href="#">
                                        <i className="fas fa-chart-bar"></i>
                                        <span className="bot-line"></span>Report
                                    </a>
                                    <ul className="header3-sub-list list-unstyled">
                                        <li>
                                            <a href="#">Student result</a>
                                        </li>
                                        <li>
                                            <a href="#">Assessment result</a>
                                        </li>

                                    </ul>
                                </li>

                                {/* <li className="has-sub">
                                    <Link href="#">
                                        <a onClick={(e) => handleLogout(e)}>
                                            <i className="zmdi zmdi-power"></i>
                                            <span className="bot-line"></span>Logout
                                        </a>
                                    </Link>
                                </li> */}
                            </ul>
                        </div>

                        <div className="header__tool">
                            <div className="account-wrap">
                                <div id="myDIV" className="account-item account-item--style2 clearfix js-item-menu">
                                    <div className="content">
                                        <a className="js-acc-btn" onClick={(e) => toggleAdmin(e)}>{logindata.userdata.firstName}</a>
                                    </div>
                                    <div className="account-dropdown js-dropdown">
                                        <div className="info clearfix">
                                            <div className="content">
                                                <h5 className="name">
                                                    <a>{logindata.userdata.firstName}</a>
                                                </h5>
                                                <span className="email">{logindata.userdata.email}</span>
                                            </div>
                                        </div>
                                        <div className="account-dropdown__body">
                                            <div className="account-dropdown__item">
                                                <Link href={`/userProfile/${logindata.userdata._id}`}>
                                                    <a>
                                                        <i className="zmdi zmdi-account"></i>Account</a>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="account-dropdown__footer">
                                            <a onClick={(e) => handleLogout(e)}>
                                                <i className="zmdi zmdi-power"></i>Logout
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* <!-- END HEADER DESKTOP-->
                    <!-- HEADER MOBILE--> */}
            <header className="header-mobile header-mobile-2 d-block d-lg-none">
                <div className="header-mobile__bar">
                    <div className="container-fluid">
                        <div className="header-mobile-inner">
                            <Link href="/">
                                <a>
                                    Yam Admin
                                </a>
                            </Link>

                            <button id="myDIV1" className="hamburger hamburger--slider" type="button" onClick={(e) => toggleMobile(e)}>
                                <span className="hamburger-box">
                                    <span className="hamburger-inner"></span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <nav className="navbar-mobile">
                    <div className="container-fluid">
                        <ul className="navbar-mobile__list list-unstyled">
                            <li>
                                <Link href="/">
                                    <a>
                                        <i className="fas fa-tachometer-alt"></i>Dashboard
                                    </a>
                                </Link>

                            </li>
                            <li className="has-sub">
                                <a className="js-arrow" href="#">
                                    <i className="fas fa-user"></i>Students
                                    <span className="bot-line"></span>
                                </a>
                                <ul className="navbar-mobile-sub__list list-unstyled js-sub-list">
                                    <li>
                                        <Link href="/students">
                                            <a>Students list</a>
                                        </Link>

                                    </li>
                                    <li>
                                        <Link href="/student">
                                            <a>Add Student</a>
                                        </Link>

                                    </li>

                                </ul>
                            </li>
                            <li className="has-sub">
                                <a className="js-arrow" href="#">
                                    <i className="fas fa-users"></i>Teachers
                                    <span className="bot-line"></span>
                                </a>
                                <ul className="navbar-mobile-sub__list list-unstyled js-sub-list">
                                    <li>
                                        <Link href="/teachers">
                                            <a>Teachers list</a>
                                        </Link>

                                    </li>
                                    <li>
                                        <Link href="/teacher">
                                            <a>Add Teacher</a>
                                        </Link>

                                    </li>

                                </ul>
                            </li>
                            <li className="has-sub">
                                <a className="js-arrow" href="#">
                                    <i className="fas  fa-th-large"></i>e-Learning
                                    <span className="bot-line"></span>
                                </a>
                                <ul className="navbar-mobile-sub__list list-unstyled js-sub-list">

                                    <li>
                                        <Link href="/courses">
                                            <a >Courses</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/lessons">
                                            <a>Lessons</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/exams">
                                            <a>Exams</a>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/questions">
                                            <a>Questions</a>
                                        </Link>

                                    </li>
                                    <li>
                                        <Link href="#">
                                            <a>Assessments</a>
                                        </Link>

                                    </li>
                                    <li>
                                        <Link href="#">
                                            <a>Assessment questions</a>
                                        </Link>

                                    </li>
                                    <li>
                                        <Link href="/categories">
                                            <a>Categories</a>
                                        </Link>

                                    </li>

                                </ul>
                            </li>

                            <li className="has-sub">
                                <a className="js-arrow" href="#">
                                    <i className="fas fa-chart-bar"></i>
                                    <span className="bot-line"></span>Report
                                </a>
                                <ul className="navbar-mobile-sub__list list-unstyled js-sub-list">
                                    <li>
                                        <Link href="#">
                                            <a>Student result</a>
                                        </Link>

                                    </li>
                                    <li>
                                        <Link href="#">
                                            <a>Assessment result</a>
                                        </Link>

                                    </li>

                                </ul>
                            </li>


                            <li>
                                <Link href="#">
                                    <a>
                                        <i className="zmdi zmdi-account"></i>Account
                                    </a>
                                </Link>

                            </li>
                            <li>
                                <a onClick={(e) => handleLogout(e)}>
                                    <i className="zmdi zmdi-power"></i>Logout
                                </a>
                            </li>

                        </ul>
                    </div>
                </nav>
            </header>

        </>
    );
}


