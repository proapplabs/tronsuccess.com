import Toast from '@components/toast'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
export default class Document extends NextDocument {
    render() {
        return (
            <Html lang='en'>
                <Head>
                    <meta name="description" content="Join tronsuccess.com to become a mining millionaire. Use the latest mining machines and Defi technology to ensure all users get the most TRX revenue." />
                    <link rel="preconnect" href="https://cdn.jsdelivr.net" />
                    <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
                    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />

                </Head>
                <body>
                    <Toast />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}