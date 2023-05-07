import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import TeamItems from '@components/mine/team/teamItems'
import TeamHead from '@components/mine/team/teamHead'
import Link from 'next/link'
import HeadBox from '@components/headBox'

import useTranslation from 'next-translate/useTranslation'

export default function Team({ datas }) {
    const { t, lang } = useTranslation('common');
    return (
        <Layout>
            <HeadBox title="Team" />
            <div className='pageTitle'>
                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>{t("team")}</h1>
            </div>
            <TeamHead />
            <TeamItems />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
