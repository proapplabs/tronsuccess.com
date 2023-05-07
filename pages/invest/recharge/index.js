import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import InvestMenu from '@components/invest/investMenu'
import InvestTransferOptionButton from '@components/invest/investTransferOptionButton'
import HeadBox from '@components/headBox'
export default function Home({ datas }) {
    return (
        <Layout>
            <HeadBox title="Recharge" />
            <InvestTransferOptionButton />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
