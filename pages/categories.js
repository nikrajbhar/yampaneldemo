import Navbar from "./Navbar"
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { absoluteUrl } from "../components/getAbsoluteUrl";
import ErrorPage from 'next/error';
import { parseCookies } from 'nookies'
import $ from "jquery";

export default function category(props) {

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

    const { categorys } = props;

    var userID;
    { islogged ? userID = logindata.userdata._id : null }

    const refreshData = () => {
        router.replace(router.asPath);
    }

    var x = categorys.length;
    var y = 0;
    const categorysList = categorys.map(category => {
        return (
            <>
                <tr className="tr-shadow" />
                <tr role="row" className="odd" key={category._id} >
                    <td>{y < x ? y = y + 1 : null}</td>
                    <td>{category.categoryName}</td>
                    <td>{category.languageId.languageName}</td>
                    <td> {category.isActive ? <span className="status--process">Active</span> : <span className="status--denied">Inactive</span>}</td>
                    <td>
                        <Link href={'/category/[id]'} as={`/category/${category._id}`}>
                            <a className="btn btn-sm btn-primary">  <i className="fas fa-pencil-square-o"></i></a>
                        </Link>
                        {/* <a style={{ marginLeft: 5 }} className="btn btn-sm btn-danger"><i className="fas fa-trash"></i></a> */}
                    </td>

                </tr>
                <tr className="spacer"></tr>
            </>
        )
    })



    const deleteProduct = async ({ id }) => {

        const res = await fetch(`/api/category/${id}`, {
            method: "DELETE"
        })


        if (res.status == 200) {
            refreshData();
        }
        await res.json()
    }




    return (
        <>
            <Head>
                <title>Category List</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            {islogged ?
                <div className="page-wrapper">

                    {/* <!-- HEADER DESKTOP--> */}
                    <Navbar />

                    {/* <!-- END HEADER MOBILE -->

        <!-- PAGE CONTENT--> */}

                    <div className="page-content">

                        {/* <!-- WELCOME--> */}

                        <section className="welcome p-t-10">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h1 className="title-4">
                                            Category List
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
                                        <div className="offset-md-9 col-md-3">
                                            <Link href="/category">
                                                <a className="btn btn-sm btn-success">Add </a>
                                            </Link>
                                        </div>
                                        <div className="offset-md-1 col-md-10">

                                            <div className="table-responsive table-responsive-data2">
                                                <table className="table table-data2">
                                                    <thead>
                                                        <tr>
                                                            <th>Category No.</th>
                                                            <th>Category Name</th>
                                                            <th>language</th>
                                                            <th>Status</th>
                                                            <th>Action</th>
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
            const { url } = absoluteUrl(req);
            const res = await fetch(`${url}/api/categoryapi`, {
                headers: {
                    'Authorization': token,
                },
            })
            const data = await res.json()

            return {
                props: {
                    categorys: data.categories
                }
            }
        } else {
            return { props: {} };
        }
    } catch (error) {
        res.statusCode = 404;
        return { props: {} };
    }
}