import Navbar from "./Navbar"
import Link from 'next/link'
import Head from 'next/head'
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { absoluteUrl } from "../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from "jquery";

export default function courses(props) {
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

    const { courses } = props;

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const deleteProduct = async ({ id }) => {

        const res = await fetch(`/api/course/${id}`, {
            method: "DELETE"
        })
        console.log("x", res.status);

        if (res.status == 200) {
            refreshData();
        }
        await res.json()
    }


    const categorysList = courses.map((course, index) => {

        return (
            <>
                <tr className="tr-shadow" />
                <tr role="row" className="odd" key={course._id} >
                    <td>{index + 1}</td>
                    <td>{course.image ? <img className='rectangle-image' src={course.image} alt="" /> : '-'} </td>
                    {/* <td>{course.courseCode ? course.courseCode : '-'}</td> */}
                    <td>{course.courseName}</td>
                    <td>{course.languageId.languageName}</td>
                    <td>{course.categoryId ? course.categoryId.categoryName : '-'}</td>
                    <td>{course.duration} min</td>
                    <td>{course.teacherId.firstName}</td>
                    <td>{course.isActive ? <span className="status--process">Active</span> : <span className="status--denied">Inactive</span>}</td>
                    <td>
                        <Link href={'/course/view/[id]'} as={`/course/view/${course._id}`}>
                            <a className="btn btn-sm btn-primary"><i className="fas fa-eye"></i></a>
                        </Link>
                        {/* <Link href={`/question_AI?course=${lesson.courseId._id}&lesson=${lesson._id}`} as={`/question_AI?course=${lesson.courseId._id}&lesson=${lesson._id}`}></Link> */}
                        <Link href={'/course/[id]'} as={`/course/${course._id}`}>
                            <a style={{ marginLeft: 5 }} className="btn btn-sm btn-success">  <i className="fas fa-pencil-square-o"></i></a>
                        </Link>
                        {/* <a style={{ marginLeft: 5 }} className="btn btn-sm btn-danger"><i className="fas fa-trash"></i></a> */}
                    </td>
                </tr>
                <tr className="spacer"></tr>
            </>
        )
    })

    return (
        <>
            <Head>
                <title>Course List</title>
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
                                            Course List
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
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                            <div className="offset-lg-11 col-lg-1" >

                                                <Link href="/course">
                                                    <a className="btn btn-sm btn-success">Add </a>
                                                </Link>
                                            </div>

                                            <div className="table-responsive table-responsive-data2">
                                                <table className="table table-data2">
                                                    <thead>
                                                        <tr>
                                                            <th>Course No.</th>
                                                            <th>Course Image</th>
                                                            {/* <th>Course Code</th> */}
                                                            <th>Course Name</th>
                                                            <th>Language</th>
                                                            <th>Category</th>
                                                            <th>Duration</th>
                                                            <th>Teacher</th>

                                                            {/* <th>Start Date</th> */}
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {categorysList}

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
            const res = await fetch(`${url}/api/courseapi`, {
                headers: {
                    'Authorization': token,
                }
            })
            const data = await res.json()
            return {
                props: {
                    courses: data.course
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

