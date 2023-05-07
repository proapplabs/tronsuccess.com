import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import Link from 'next/link'
import HeadBox from '@components/headBox'
import MiningList from '@components/invest/miningList'
export default function Minings() {
    return (
        <Layout>
            <HeadBox title="Minings" />
            <div className='pageTitle'>
                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>Minings</h1>
                <MiningList />
            </div>
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
