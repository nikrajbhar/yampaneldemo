import Navbar from "../../Navbar"
import Link from 'next/link'
import Head from 'next/head'
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { lessonType, userType } from "../../../components/global"
import Moment from 'moment';
import { absoluteUrl } from "../../../components/getAbsoluteUrl";
import { parseCookies } from 'nookies'
import ErrorPage from 'next/error';


export default function courseView(props) {
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
    const { course, completedCourse, courseLearning, percent, lessons } = props;
    
    const lessonList = lessons.map((lesson, index) => {
        return (
            <>
                <tr className="tr-shadow" />
                <tr role="row" className="odd" key={lesson._id} >
                    <td>{index + 1}</td>
                    <td>{lesson.image ? <img className='rectangle-image' src={lesson.image} alt="" /> : '-'}</td>
                    <td>{lesson.lessonName}</td>
                    {/* <td>{lesson.courseId.courseName}</td> */}
                    <td>{lesson.typeid == lessonType.text ? 'Text' : lesson.typeid == lessonType.video ? 'Video' : null}</td>
                    <td>{lesson.duration} min</td>
                    <td> {lesson.isActive ? <span className="status--process">Active</span> : <span className="status--denied">Inactive</span>}  </td>

                    <td>
                        <Link href={`/question_AI?course=${lesson.courseId}&lesson=${lesson._id}`} as={`/question_AI?course=${lesson.courseId}&lesson=${lesson._id}`}>
                            <a className="btn btn-sm btn-info"> <i className="fas fa-question-circle"></i></a>
                        </Link>
                        <Link href={'/lesson/[id]'} as={`/lesson/${lesson._id}`}>
                            <a style={{ marginLeft: 5 }} className="btn btn-sm btn-primary">  <i className="fas fa-pencil-square-o"></i></a>
                        </Link>

                    </td>
                </tr>
                <tr className="spacer"></tr>
            </>
        )
    })
    return (
        <>
            <Head>
                <title>Course</title>
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
                                            Course
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
                                        <div className="col-xl-3 col-xxl-4 col-lg-4">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="card">
                                                        <img className="rectangle-image-view" src={course.image} alt="" />
                                                        <div className="card-body">
                                                            <h4 className="mb-0">{course.courseName}</h4>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="card">
                                                        <div className="card-header">
                                                            <h4 className="card-title">About Course</h4>
                                                        </div>
                                                        <div className="card-body pb-0">
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item d-flex px-0 justify-content-between">
                                                                    <strong>Category</strong>
                                                                    <span className="mb-0">{course.categoryId ? course.categoryId.categoryName : '-'}</span>
                                                                </li>
                                                                <li className="list-group-item d-flex px-0 justify-content-between">
                                                                    <strong>Language</strong>
                                                                    <span className="mb-0">{course.languageId.languageName}</span>
                                                                </li>
                                                                <li className="list-group-item d-flex px-0 justify-content-between">
                                                                    <strong>Duration</strong>
                                                                    <span className="mb-0">{course.duration} min</span>
                                                                </li>
                                                                <li className="list-group-item d-flex px-0 justify-content-between">
                                                                    <strong>Teacher</strong>
                                                                    <span className="mb-0">{course.teacherId.firstName} </span>
                                                                </li>

                                                                <li className="list-group-item d-flex px-0 justify-content-between">
                                                                    <strong>Date</strong>
                                                                    <span className="mb-0">{Moment(course.createdDate).format('DD MMMM YYYY')}</span>
                                                                </li>
                                                                <li className="list-group-item d-flex px-0 justify-content-between">
                                                                    <strong>Status</strong>
                                                                    <span className="mb-0">{course.isActive ? <span className="status--process">Active</span> : <span className="status--denied">Inactive</span>}</span>
                                                                </li>
                                                                <li className="list-group-item d-flex px-0 justify-content-between">
                                                                    <strong>Actions</strong>
                                                                    <span className="mb-0">
                                                                        <Link href="/addcourse">
                                                                            <a className="btn btn-sm btn-primary">  <i className="fas fa-pencil-square-o"></i></a>
                                                                        </Link>



                                                                    </span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="card-footer pt-0 pb-0 text-center">
                                                            <div className="row">
                                                                <div className="col-6 pt-3 pb-3 border-right">
                                                                    <h3 className="mb-1 text-primary">{completedCourse.length}</h3>
                                                                    <span>Completed</span>
                                                                </div>
                                                                <div className="col-6 pt-3 pb-3 ">
                                                                    <h3 className="mb-1 text-primary">{courseLearning}</h3>
                                                                    <span>Learning</span>
                                                                </div>
                                                                <div className="col-6 pt-3 pb-3 border-right">
                                                                    <h3 className="mb-1 text-success">{percent[0] ? percent[0] : 0}</h3>
                                                                    <span>Lessons Passed</span>
                                                                </div>
                                                                <div className="col-6 pt-3 pb-3 ">
                                                                    <h3 className="mb-1 text-danger">{percent[1] ? percent[1] : 0}</h3>
                                                                    <span>Lessons Failed</span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-9 col-xxl-8 col-lg-8">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h4 className="text-primary">Course Information</h4>
                                                    <ul className="list-group mb-3 list-group-flush">
                                                        <li className="list-group-item border-0 px-0">{course.detail}</li>
                                                    </ul>
                                                    <h4 className="text-primary">Lessons Information</h4>
                                                    <div className="offset-lg-10 col-lg-1" >

                                                        <Link href="/lesson">
                                                            <a className="btn btn-sm btn-success">Add</a>
                                                        </Link>
                                                    </div>
                                                    <table className="table table-data2">
                                                        <thead>
                                                            <tr>
                                                                <th>Lesson No.</th>
                                                                <th>Lesson Image</th>

                                                                <th>Lesson Name</th>
                                                                {/* <th>Course</th> */}

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
                                            </div>
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
    var { req, params: { id }, res  } = ctx
    var { token } = parseCookies(ctx)
    try {
        if (token) {
        const { url } = absoluteUrl(req);
        const [courseRes, lessonRes,] = await Promise.all([
            fetch(`${url}/api/courseView/${id}`, {
                headers: {
                    'Authorization': token,
                }
            }),
            fetch(`${url}/api/lessonsByCourse?courseId=${id}`, {
                headers: {
                    'Authorization': token,
                }
            }),


        ]);
        const [course, lessons,] = await Promise.all([
            courseRes.json(),
            lessonRes.json(),
        ]);

        return { props: { course: course.course, completedCourse: course.courseCompleted, courseLearning: course.courseLearning, percent: course.finalpercentage, lessons } };
        }else{
            return { props: {} };
        }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }

}