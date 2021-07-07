import Navbar from "./Navbar"
import Head from 'next/head';
import Link from 'next/link';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { lessonType } from "../components/global";
import { absoluteUrl } from "../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from "jquery";

export default function lessons(props) {

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

    const { lessons } = props;

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const deleteProduct = async ({ id }) => {

        const res = await fetch(`/api/lesson/${id}`, {
            method: "DELETE"
        })
        console.log("x", res.status);

        if (res.status == 200) {
            refreshData();
        }
        await res.json()
    }

    const lessonList = lessons.map((lesson, index) => {
        return (
            <>
                <tr className="tr-shadow" />
                <tr role="row" className="odd" key={lesson._id} >
                    <td>{index + 1}</td>
                    <td>{lesson.image ? <img className='rectangle-image' src={lesson.image} alt="" /> : '-'}</td>
                    <td>{lesson.lessonName}</td>
                    <td>{lesson.courseId.courseName}</td>
                    <td>{lesson.typeid == lessonType.text ? 'Text' : lesson.typeid == lessonType.video ? 'Video' : null}</td>
                    <td>{lesson.duration} min</td>
                    <td> {lesson.isActive ? <span className="status--process">Active</span> : <span className="status--denied">Inactive</span>}  </td>

                    <td>
                        <Link href={`/question_AI?course=${lesson.courseId._id}&lesson=${lesson._id}`} as={`/question_AI?course=${lesson.courseId._id}&lesson=${lesson._id}`}>
                            <a className="btn btn-sm btn-info"> <i className="fas fa-question-circle"></i></a>
                        </Link>
                        <Link href={'/lesson/[id]'} as={`/lesson/${lesson._id}`}>
                            <a style={{ marginLeft: 5 }} className="btn btn-sm btn-primary">  <i className="fas fa-pencil-square-o"></i></a>
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
                <title>Lesson List</title>
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
                                            Lesson List
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
                                        <div className="offset-lg-11 col-lg-1 offset-md-11 col-md-1" >

                                            <Link href="/lesson">
                                                <a className="btn btn-sm btn-success">Add </a>
                                            </Link>
                                        </div>
                                        <div className="col-md-12">

                                            <div className="table-responsive table-responsive-data2">
                                                <table className="table table-data2">
                                                    <thead>
                                                        <tr>
                                                            <th>Lesson No.</th>
                                                            <th>Lesson Image</th>

                                                            <th>Lesson Name</th>
                                                            <th>Course</th>

                                                            <th>Type</th>
                                                            <th>Duration</th>

                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {lessonList}
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
            const { url } = absoluteUrl(req);
            const res = await fetch(`${url}/api/lessonapi`, {
                headers: {
                    'Authorization': token,
                }
            })
            const data = await res.json()
            return {
                props: {
                    lessons: data.lessons
                }
            }
        } else {
            return {
                props: {}
            }
        }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }
}