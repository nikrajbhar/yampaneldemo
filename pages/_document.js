import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>

                    <meta charSet="UTF-8" />                   
                    <meta name="description" content="Yam" />
                    <meta name="author" content="Yam" />
                    <meta name="keywords" content="Yam" />                    
                   
                    <script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"></script>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css" />

                    {/* <!-- Fontfaces CSS--> */}

                    <link href="/css/font-face.css" rel="stylesheet" media="all" />
                    <link href="/vendor/font-awesome-4.7/css/font-awesome.min.css" rel="stylesheet" media="all" />
                    <link href="/vendor/font-awesome-5/css/fontawesome-all.min.css" rel="stylesheet" media="all" />
                    <link href="/vendor/mdi-font/css/material-design-iconic-font.min.css" rel="stylesheet" media="all" />

                    {/* <!-- Bootstrap CSS--> */}

                    <link href="/vendor/bootstrap-4.1/bootstrap.min.css" rel="stylesheet" media="all" />

                    {/* <!-- Vendor CSS--> */}

                    <link href="/vendor/animsition/animsition.min.css" rel="stylesheet" media="all" />
                    <link href="/vendor/bootstrap-progressbar/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet" media="all" />
                    <link href="/vendor/wow/animate.css" rel="stylesheet" media="all" />
                    <link href="/vendor/css-hamburgers/hamburgers.min.css" rel="stylesheet" media="all" />
                    <link href="/vendor/slick/slick.css" rel="stylesheet" media="all" />
                    <link href="/vendor/select2/select2.min.css" rel="stylesheet" media="all" />
                    <link href="/vendor/perfect-scrollbar/perfect-scrollbar.css" rel="stylesheet" media="all" />

                    {/* <!-- Main CSS--> */}
                    <link href="/css/theme.css" rel="stylesheet" media="all" />
                    

                </Head>
                <body>               

                    <Main/>
                
                    <NextScript />

                    {/* <!-- Jquery JS--> */}

                    <script src="/vendor/jquery-3.2.1.min.js"></script>

                    {/* <!-- Bootstrap JS--> */}

                    <script src="/vendor/bootstrap-4.1/popper.min.js"></script>
                    <script src="/vendor/bootstrap-4.1/bootstrap.min.js"></script>                   
                   
                    
                    {/* <!-- Vendor JS       --> */}

                    <script src="/vendor/slick/slick.min.js">
                    </script>
                    <script src="/vendor/wow/wow.min.js"></script>
                    <script src="/vendor/animsition/animsition.min.js"></script>
                    <script src="/vendor/bootstrap-progressbar/bootstrap-progressbar.min.js">
                    </script>
                    <script src="/vendor/counter-up/jquery.waypoints.min.js"></script>
                    <script src="/vendor/counter-up/jquery.counterup.min.js">
                    </script>
                    <script src="/vendor/circle-progress/circle-progress.min.js"></script>
                    <script src="/vendor/perfect-scrollbar/perfect-scrollbar.js"></script>
                    <script src="/vendor/chartjs/Chart.bundle.min.js"></script>
                    <script src="/vendor/select2/select2.min.js">
                    </script>

                    

                    {/* <!-- Main JS--> */}
                    
                    <script src="/js/main.js"></script>
                    <script src="/js/stepForm.js"></script>
                    
                </body>
            </Html>
        );
    }
}

export default MyDocument;
