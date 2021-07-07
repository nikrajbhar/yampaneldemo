import Navbar from "./Navbar"
import Link from 'next/link';
import Head from 'next/head'
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { QuestionType } from "../components/global";
import { absoluteUrl } from "../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';
import $ from "jquery";

export default function questions(props) {

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

    const { quizzes } = props;


    const refreshData = () => {

        router.replace(router.asPath);
    }

    const deleteProduct = async ({ id }, event) => {

        const res = await fetch(`/api/question/${id}`, {
            method: "DELETE"
        })


        if (res.status == 200) {
            refreshData(event);
        }
        await res.json()
    }

    var x = quizzes.length;
    var y = 0;

    const quizzesList = quizzes.map((quizze) => {
        return (
            <>
                <tr className="tr-shadow" />
                <tr role="row" className="odd" key={quizze._id} >
                    <td>{y < x ? y = y + 1 : null}</td>
                    <td>{quizze.quizName}</td>
                    <td>{!quizze.examId ? '-' : quizze.examId.lessonId.courseId.courseName}</td>
                    <td>{!quizze.examId ? '-' : quizze.examId.lessonId.lessonName}</td>
                    <td>{!quizze.examId ? '-' : quizze.examId.examName}</td>
                    <td>{quizze.questionType == QuestionType.text ? 'Text' : quizze.questionType == QuestionType.multiplechoice ? 'Multichoice' : null}</td>
                    {/* <td>{quizze.marks}</td> */}
                    <td> {quizze.isActive ? <span className="status--process">Active</span> : <span className="status--denied">Inactive</span>}  </td>

                    <td>
                        {/* href={'/category/[id]'} as={`/category/${category._id}`} */}


                        <Link href={'/question/[id]'} as={`/question/${quizze._id}`}>
                            <a className="btn btn-sm btn-primary">  <i className="fas fa-pencil-square-o"></i></a>
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
                <title>Question List</title>
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
                                            Question List
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
                                        <div className="offset-lg-11 col-lg-2" >
                                            <Link href="/question">
                                                <a className="btn btn-sm btn-success">Add </a>
                                            </Link>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="table-responsive table-responsive-data2">
                                                <table className="table table-data2">
                                                    <thead>
                                                        <tr>
                                                            <th>QUESTION NO. </th>
                                                            <th>QUESTION</th>
                                                            <th>Course</th>
                                                            <th>Lesson</th>
                                                            <th>Exam</th>
                                                            <th>Type</th>
                                                            {/* <th>Marks</th> */}
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {quizzesList}

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
            const res = await fetch(`${url}/api/quizzeapi`, {
                headers: {
                    'Authorization': token,
                }
            })
            const data = await res.json()

            return {
                props: {
                    quizzes: data.quizzes
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