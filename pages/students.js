import Link from 'next/link';
import Navbar from './Navbar';
import Head from 'next/head'
import { useSelector } from "react-redux";
import { useRouter } from 'next/router';
import { gender, userType } from "../components/global";
import Moment from 'moment';
import { absoluteUrl } from "../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from "jquery";

export default function students(props) {

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

    const { users } = props;

    const studentList = users.map(user => {
        let imagesrc = user.profileImage ? user.profileImage : 'images/person.png';
        return (
            <>
                <tr className="tr-shadow" />
                <tr role="row" className="odd" key={user._id} >
                    <td><img className="rounded-circle img-profile" width="35" src={imagesrc} alt="" /></td>
                    {/* <td>{user.rollno ? user.rollno : '-'}</td> */}
                    <td>{user.firstName ? user.firstName : '-'}</td>
                    <td>{user.gender == gender.male ? 'Male' : user.gender == gender.female ? 'Female' : '-'}</td>
                    <td><a><strong>{user.mobileNo ? user.mobileNo : '-'}</strong></a></td>
                    <td><a><strong>{user.email}</strong></a></td>
                    <td>{Moment(user.createdDate).format('DD/MM/YYYY')}</td>
                    <td> {user.isActive ? <span className="status--process">Active</span> : <span className="status--denied">Inactive</span>}</td>
                    <td>
                        <Link href={'/student/[id]'} as={`/student/${user._id}`}>
                            <a className="btn btn-sm btn-primary">  <i className="fas fa-pencil-square-o"></i></a>
                        </Link>
                        {/* <a className="btn btn-sm btn-danger"><i className="fas fa-trash"></i></a> */}
                    </td>
                </tr>
                <tr className="spacer"></tr>
            </>
        )
    })

    return (
        <>
            <Head>
                <title>Student List</title>
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
                                            Student List
                                        </h1>
                                        <hr className="line-seprate" />
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- END WELCOME-->  */}
                        {/* <!-- MAIN CONTENT--> */}
                        <div className="main-content">
                            <div className="section__content section__content--p30">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12">

                                            <div className="table-responsive table-responsive-data2">
                                                <table className="table table-data2">
                                                    <thead>
                                                        <tr>
                                                            <th>Profile Image</th>
                                                            {/* <th>Roll No.</th> */}
                                                            <th>Name</th>
                                                            <th>Gender</th>
                                                            <th>Mobile No.</th>
                                                            <th>Email</th>
                                                            <th>Admission Date</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {studentList}

                                                    </tbody>
                                                </table>
                                            </div>
                                            {/* <!-- END DATA TABLE --> */}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null}
        </>
    );
}

export async function getServerSideProps(ctx) {
    var { req, res } = ctx
    var { token } = parseCookies(ctx)
    try {
        if (token) {
            const { url } = absoluteUrl(req)
            const res = await fetch(`${url}/api/userapi?usertype=${userType.student}`, {
                headers: {
                    'Authorization': token,
                }
            });
            const data = await res.json();

            return {
                props: {
                    users: data.users
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