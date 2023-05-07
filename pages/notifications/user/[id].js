import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import { useRouter } from 'next/router'
import NotificationsItems from '@components/notification/notificationsItems'
import HeadBox from '@components/headBox'
export default function NotificationsDetail() {
    const router = useRouter()
    return (
        <Layout>
            <HeadBox title="User Notification Detail" />
            <div className='pageTitle'>
                <span className='back' onClick={() => router.back()} ><i className='fa fa-chevron-left'></i></span>

                <h1>Notification</h1>
            </div>
            <NotificationsItems action="detail" table="user" />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
