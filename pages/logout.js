
import Head from 'next/head'
import { deleteCookie } from 'cookies-next';
export default function Logout({ datas }) {
    return (
        <>
            <Head><title>Lagout</title></Head>
        </>
    )
}
export async function getServerSideProps({ req, res }) {
    // return {
    //     props: {}
    // }

    deleteCookie('init', { req, res });
    deleteCookie('domain', { req, res });
    deleteCookie('token', { req, res });
    deleteCookie('popupModal', { req, res });
    return {
        redirect: {
            destination: "/login",
            permanent: false,
        },
        props: {}
    }

}
