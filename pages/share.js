import { userControl } from '@utils/crypt'
import Head from 'next/head'
import Layout from '@components/layout'
import ShareCard from '@components/share/shareCard'
import Gift from '@components/share/gift'
import HeadBox from '@components/headBox'
export default function Share({ datas }) {
    return (
        <Layout>
            <HeadBox title="Share" />
            <div className='sharePage'>
                <ShareCard />
                <Gift />
            </div>

        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
