import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import Link from 'next/link'
import HeadBox from '@components/headBox'
import useTranslation from 'next-translate/useTranslation'
export default function App({ datas }) {
    const { t, lang } = useTranslation('common');
    return (
        <Layout>
            <HeadBox title="App" />
            <div className='pageTitle'>
                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>{t("our-apps")}</h1>
            </div>
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
