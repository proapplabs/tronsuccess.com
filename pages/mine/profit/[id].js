import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import ProfitDetail from '@components/mine/profit/profitDetail'
import Link from 'next/link'
import HeadBox from '@components/headBox'
export default function ProfitListDetail() {
    return (
        <Layout>
            <HeadBox title="Profit List Detail" />
            <div className='pageTitle'>

                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>Profit List Detail</h1>
            </div>
            <ProfitDetail />

        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {})
}
