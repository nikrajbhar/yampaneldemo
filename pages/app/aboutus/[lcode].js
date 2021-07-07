import ErrorPage from 'next/error';
import Head from 'next/head';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

import { appName } from '../../../components/global';

const languageStrings = {
    en: {
        paragraph1: `${appName} is here to help you learn anything without internet.`
    },
    fr: {
        paragraph1: `${appName} est là pour vous aider à apprendre quoi que ce soit sans Internet.`
    }
}

export default function aboutus() {
    const router = useRouter();
    const languageCode = router.query.lcode;

    if (languageCode) {
        if (Object.keys(languageStrings).some(x => x == languageCode)) {
            const aboutUsData = languageStrings[languageCode];
            return (
                <>
                    <Head>
                        <title>About Us</title>
                        <style>{'body { background-color: #F7F7F7; }'}</style>
                    </Head>
                    <div className='aboutus-container'>
                        <p className='aboutus-text'>
                            {aboutUsData.paragraph1}
                        </p>
                    </div>
                </>
            );
        } else {
            return <ErrorPage statusCode={404} />
        }
    } else {
        return null;
    }
}