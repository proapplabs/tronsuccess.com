import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import { useRouter } from 'next/router'
import NotificationsItems from '@components/notification/notificationsItems'
import HeadBox from '@components/headBox'
import useTranslation from 'next-translate/useTranslation'

export default function NotificationsDetail() {
    const { t, lang } = useTranslation('common');
    const router = useRouter()
    return (
        <Layout>
            <HeadBox title="System Notification Detail" />
            <div className='pageTitle'>
                <span className='back' onClick={() => router.back()} ><i className='fa fa-chevron-left'></i></span>
                <h1>{t("notification")}</h1>
            </div>
            <NotificationsItems action="detail" table="system" />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
