import Navbar from "./Navbar"
import Head from 'next/head'
import Link from 'next/link';
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { absoluteUrl } from "../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from "jquery";

export default function exams(props) {

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

    const { exams } = props;

    const refreshData = () => {
        router.replace(router.asPath);
    }

    const deleteProduct = async ({ id }) => {

        const res = await fetch(`/api/exam/${id}`, {
            method: "DELETE"
        })
        console.log("x", res.status);

        if (res.status == 200) {
            refreshData();
        }
        await res.json()
    }

    var x = exams.length;
    var y = 0;

    const examList = exams.map(exam => {
        return (
            <>
                <tr className="tr-shadow" />
                <tr role="row" className="odd" key={exam._id} >
                    <td>{y < x ? y = y + 1 : null}</td>
                    <td>{exam.image ? <img className='rectangle-image' src={exam.image} alt="" /> : '-'}</td>
                    <td>{exam.examName}</td>
                    <td>{exam.lessonId.courseId.courseName}</td>
                    <td>{exam.lessonId.lessonName}</td>
                    <td>{exam.duration} min</td>
                    {/* <td>{exam.totalMarks}</td> */}
                    <td> {exam.isActive ? <span className="status--process">Active</span> : <span className="status--denied">Inactive</span>}  </td>

                    <td>
                        <Link href={`/question_AI?course=${exam.lessonId.courseId._id}&lesson=${exam.lessonId._id}&exam=${exam._id}`} as={`/question_AI?course=${exam.lessonId.courseId._id}&lesson=${exam.lessonId._id}&exam=${exam._id}`}>
                            <a className="btn btn-sm btn-info"> <i className="fas fa-question-circle"></i></a>
                        </Link>

                        <Link href={'/exam/[id]'} as={`/exam/${exam._id}`}>
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
                <title>Assessment List</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {islogged ?
                <div className="page-wrapper">


                    <Navbar />

                    {/* <!-- PAGE CONTENT--> */}
                    <div className="page-content">

                        {/* <!-- WELCOME--> */}
                        <section className="welcome p-t-10">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="title-4">
                                            Assessment List
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
                                        <div className="offset-md-11 col-md-1 offset-sm-11 col-sm-1 offset-9 col-2" >

                                            <Link href="/exam">
                                                <a className="btn btn-sm btn-success">Add </a>
                                            </Link>
                                        </div>
                                        <div className="col-md-12">

                                            <div className="table-responsive table-responsive-data2">
                                                <table className="table table-data2">
                                                    <thead>
                                                        <tr>
                                                            <th>Assessment No.</th>
                                                            <th>Assessment Image</th>
                                                            <th>Name</th>
                                                            <th>Course</th>
                                                            <th>Lesson</th>
                                                            <th>Duration</th>
                                                            {/* <th>Total Marks</th> */}
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {examList}

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
            const res = await fetch(`${url}/api/examapi`, {
                headers: {
                    'Authorization': token,
                }
            })
            const data = await res.json()
            return {
                props: {
                    exams: data.exams
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

