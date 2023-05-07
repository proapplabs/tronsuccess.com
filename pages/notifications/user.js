import { userControl } from '@utils/crypt'
import Head from 'next/head'
import Layout from '@components/layout'
import TopMenu from '@components/topMenu'
import NotificationsItems from '@components/notification/notificationsItems'
import HeadBox from '@components/headBox'
export default function NotificationsUser({ datas }) {
    return (
        <Layout>
            <HeadBox title="User Notifications" />
            <h1 className='pageTitle'>Notifications</h1>
            <TopMenu links={[
                {
                    "title": "SYSTEM ",
                    "link": "/notifications"
                },
                {
                    "title": "USER ",
                    "link": "/notifications/user"
                }
            ]} />
            <NotificationsItems action="list" table="user" />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
