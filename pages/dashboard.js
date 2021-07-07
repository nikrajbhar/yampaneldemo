import Head from 'next/head'
import Link from 'next/link'
import Navbar from "./Navbar"
import { useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { userType } from "../components/global";
import { absoluteUrl } from "../components/getAbsoluteUrl";
import ErrorPage from 'next/error';
import { parseCookies } from 'nookies'
import Moment from 'moment';

export default function dashboard(props) {

  const router = useRouter()
  const logindata = useSelector((state) => state.user);
  var islogged = logindata.islogged    // logindata will consist true or false  
  if (!islogged) {
    router.replace("/");
    return null;
  }
  // if ($.isEmptyObject(props)) {
  //   return <ErrorPage statusCode={404} />;
  // }
  var token = logindata.token

  const [month, setMonth] = useState(0)
  const [teacher, setTeacher] = useState(0)
  const [student, setStudent] = useState(0)
  const [courseCount, setCourseCount] = useState([])
  const [course, setCourse] = useState([])

  useEffect(async (req) => {

    const refreshData = () => {
      router.replace(router.asPath);
    }
    const { url } = absoluteUrl(req);
    var jsondata1 = [];

    const [usersRes, courseRes] = await Promise.all([
      fetch(`/api/userapi2`, {
        headers: {
          'Authorization': token,
        },
      }),
      fetch(`/api/studentcourseapi`, {
        headers: {
          'Authorization': token,
        },
      }),
    ]);

    const [users, courses] = await Promise.all([
      usersRes.json(),
      courseRes.json(),
    ]);

    setTeacher(users.teachers)
    setStudent(users.students)
    setCourse(courses)
    setMonth(users.addDate[5])
    // setGraph(users.addDate);

    async function getJson(url) {
      let response = await fetch(url, {
        headers: {
          'Authorization': token,
        },
      });
      let data = await response.json()
      return data;
    }

    async function main() {
      jsondata1 = await getJson(`${url}/api/pieforDashboard`)

      var ctx = document.getElementById("widgetChart5");
      var ctx1 = document.getElementById("percent-chart2");

      if (ctx) {
        ctx.height = 200;
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label: "Students",
                // data: [78, 81, 80, 64, 65, 80, 70, 75, 67, 85, 66, 68],
                data: users.addDate,
                // data: graph,
                borderColor: "transparent",
                borderWidth: "0",
                backgroundColor: "#ccc",
              }
            ]
          },
          options: {
            maintainAspectRatio: true,
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: false,
                categoryPercentage: 1,
                barPercentage: 0.65
              }],
              yAxes: [{
                display: false
              }]
            }
          }
        });
      }

      if (ctx1) {
        ctx1.height = 209;
        var myChart = new Chart(ctx1, {
          type: 'doughnut',
          data: {
            datasets: [
              {
                label: "My First dataset",
                // data: [50, 50],
                data: jsondata1,
                backgroundColor: [
                  '#00b5e9',
                  '#fa4251'
                ],
                hoverBackgroundColor: [
                  '#00b5e9',
                  '#fa4251'
                ],
                borderWidth: [
                  0, 0
                ],
                hoverBorderColor: [
                  'transparent',
                  'transparent'
                ]
              }
            ],
            labels: [
              'Failed',
              'Passed'
            ]
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            cutoutPercentage: 87,
            animation: {
              animateScale: true,
              animateRotate: true
            },
            legend: {
              display: false,
              position: 'bottom',
              labels: {
                fontSize: 14,
                fontFamily: "Poppins,sans-serif"
              }

            },
            tooltips: {
              titleFontFamily: "Poppins",
              xPadding: 15,
              yPadding: 10,
              caretPadding: 0,
              bodyFontSize: 16,
            }
          }
        });
      }
    }
    main();
  }, [])

  var sum = course.map(x => {
    return (x.courseObject.length)
  }
  )

  // console.log(console.log(
  //   sum.reduce((a, b) => a + b, 0)
  // ));

  return (
    <>

      <Head>
        <title>Dashboard</title>
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
                    <h1 className="title-4">Dashboard
                    </h1>
                    <hr className="line-seprate" />
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- END WELCOME--> */}

            {/* <!-- STATISTIC--> */}
            <section className="statistic statistic2">
              <div className="container">
                <div className="row">
                  <div className="col-md-6 col-lg-3">
                    <div className="statistic__item statistic__item--green">
                      <h2 className="number">{month}</h2>
                      <span className="desc">New Students</span>
                      <div className="icon">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="statistic__item statistic__item--primary">
                      <h2 className="number">{student}</h2>
                      <span className="desc">Total Students</span>
                      <div className="icon">
                        <i className="fas fa-user"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="statistic__item statistic__item--orange">
                      <h2 className="number">{teacher}</h2>
                      <span className="desc">Total Teachers</span>
                      <div className="icon">
                        <i className="fas fa-users"></i>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="statistic__item statistic__item--blue">
                      <h2 className="number">{course.length}</h2>
                      <span className="desc">Total courses</span>
                      <div className="icon">
                        <i className="fas fa-book"></i>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
            {/* <!-- END STATISTIC--> */}

            {/* <!-- STATISTIC CHART--> */}
            <section className="statistic-chart">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <h3 className="title-5 m-b-35">statistics</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-lg-4">
                    {/* <!-- CHART--> */}
                    <div className="statistic-chart-1">
                      <h3 className="title-3 m-b-30">Monthly New Students</h3>
                      <div className="chart-wrap">
                        <canvas id="widgetChart5"></canvas>
                      </div>
                      <div className="statistic-chart-1-note">
                        <span className="big">{month}</span>
                        <span>/ {student} User joined</span>
                      </div>
                    </div>
                    {/* <!-- END CHART--> */}
                  </div>
                  <div className="col-md-6 col-lg-4">
                    {/* <!-- TOP CAMPAIGN--> */}
                    <div className="top-campaign">
                      <h3 className="title-3 m-b-30">Top Courses</h3>
                      <div className="table-responsive">
                        <table className="table table-top-campaign">
                          {
                            course.map(x => {
                              return (
                                <tbody>
                                  <tr>
                                    <td>{x.courseName}</td>
                                    <td>{x.courseObject.length}</td>

                                  </tr>
                                </tbody>
                              )
                            })
                          }
                        </table>
                      </div>
                    </div>
                    {/* <!-- END TOP CAMPAIGN--> */}
                  </div>
                  <div className="col-md-6 col-lg-4">
                    {/* <!-- CHART PERCENT--> */}
                    <div className="chart-percent-2">
                      <h3 className="title-3 m-b-30">Passing Ratio %</h3>
                      <div className="chart-wrap">
                        <canvas id="percent-chart2"></canvas>
                        <div id="chartjs-tooltip">
                          <table></table>
                        </div>
                      </div>
                      <div className="chart-info">
                        <div className="chart-note">
                          <span className="dot dot--blue"></span>
                          <span>Pass</span>
                        </div>
                        <div className="chart-note">
                          <span className="dot dot--red"></span>
                          <span>Failed</span>
                        </div>
                      </div>
                    </div>
                    {/* <!-- END CHART PERCENT--> */}
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- END STATISTIC CHART--> */}

            {/* <!-- DATA TABLE--> */}
            <section className="p-t-20">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <h3 className="title-5 m-b-35">Shortcuts</h3>
                    <a className="btn btn-success" >
                      Student Result List
                    </a>

                    <Link href="/courses">
                      <a style={{ marginLeft: 5 }} className="btn btn-primary" >
                        Courses List
                      </a>
                    </Link>

                    <Link href="/lessons">
                      <a style={{ marginLeft: 5 }} className="btn btn-primary" >
                        Lessons List
                      </a>
                    </Link>
                    <Link href="/exams">
                      <a style={{ marginLeft: 5 }} className="btn btn-warning">
                        Assessment List
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- END DATA TABLE--> */}

            {/* <!-- COPYRIGHT--> */}
            <section className="p-t-60 p-b-20">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    {/* <!--<div className="copyright">
                                <p>Ukoor 2018 Ukoor.  </p>
                            </div>--> */}
                  </div>
                </div>
              </div>
            </section>
            {/* <!-- END COPYRIGHT--> */}
          </div>
        </div>


        : null}
    </>
  )
}

export async function getServerSideProps(ctx) {
  var { req, res } = ctx
  var { token } = parseCookies(ctx)

  try {
    if (token) {
      const { url } = absoluteUrl(req);
      const [courseRes] = await Promise.all([
        fetch(`${url}/api/courseapi`, {
          headers: {
            'Authorization': token,
          },
        }),

      ]);

      const [courses] = await Promise.all([
        courseRes.json(),


      ]);
      return { props: { courses, url } };
    } else {
      return { props: {} };
    }
  } catch (error) {
    res.statusCode = 404;
    return { props: {} };
  }
}
