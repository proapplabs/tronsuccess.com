import { userControl } from '@utils/crypt'
import Head from 'next/head'
import Layout from '@components/layout'
import TopMenu from '@components/topMenu'
import { useRouter } from 'next/router'
import NotificationsItems from '@components/notification/notificationsItems'
import HeadBox from '@components/headBox'
import useTranslation from 'next-translate/useTranslation'

export default function Notifications({ datas }) {
    const { t, lang } = useTranslation('common');
    const router = useRouter()
    return (
        <Layout>
            <HeadBox title="Notifications" />
            <div className='pageTitle'>
                <span className='back' onClick={() => router.back()} ><i className='fa fa-chevron-left'></i></span>
                <h1>{t("notifications")}</h1>
            </div>
            <NotificationsItems action="list" table="system" />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
