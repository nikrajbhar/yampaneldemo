import Head from 'next/head';
import { useEffect, useState } from 'react';
import { absoluteUrl } from '../components/getAbsoluteUrl';

export default function verify(props) {
    const [msg, setMsg] = useState("Wait for verification...");

    useEffect(() => {
        console.log(props);
        let result = props.data;
        console.log("props", result);
        if (result != null && result.code == 1) {
            setMsg("Thanks for your verification.");
        }
        else if (result != null && result.code == 2) {
            setMsg("You are already verified.");
        }
        else if (result == undefined || result == null && (result != null && (result.code == -1 || result.code == 0))) {
            setMsg("Oops! Something went wrong.");
        }
    });
    return (
        <>
            <Head>
                <title>Email Verification</title>
            </Head>
            <div className="container" style={{ alignItems: "center", width: "80%", margin: "30", marginTop: 80 }} >
                <img src="images/logo.png" style={{ height: 100, width: 250 }} />
                <h2 id="wait" style={{ width: '50%', marginTop: 50 }}>{msg}</h2>
            </div>

        </>
    );
}

export async function getServerSideProps({ req, query, res }) {
    try {
        const id = query.id;
        const vc = query.vc;
        if (id != null && id.trim() != null && vc != null && vc.trim() != null) {
            console.log("called!")
            const { url } = absoluteUrl(req);
            const res = await fetch(`${url}//api/auth/verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'uid': id,
                    'uvc': vc
                })
            });
            console.log(res);
            if (res.status >= 200 && res.status < 300) {
                const data = await res.json();
                console.log(data);
                return {
                    props: { data }
                }
            } else {
                return {
                    props: {}
                }
            }
        } else {
            return {
                props: {}
            }
        }
    } catch (error) {
        console.log("ERROR: ", error);
        res.statusCode = 404;
        return { props: {} }
    }
}
