import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import BalancesCard from '@components/mine/balancesCard'
import ProfilItems from '@components/mine/profit/profitItems'
import Link from 'next/link'
import HeadBox from '@components/headBox'
import useTranslation from 'next-translate/useTranslation'
import FilterItems from '@components/mine/profit/filterItems'

export default function Mine() {
    const { t, lang } = useTranslation('common');
    return (
        <Layout>
            <HeadBox title="Profit List" />
            <div className='pageTitle'>
                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>{t("profit-list")}</h1>
            </div>
            {/* <FilterItems /> */}
            <BalancesCard />
            <ProfilItems />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
