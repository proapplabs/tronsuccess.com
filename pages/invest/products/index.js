import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import InvestMenu from '@components/invest/investMenu'
import InvestProducts from '@components/invest/investProducts'
import HeadBox from '@components/headBox'
export default function Products({ datas }) {
    return (
        <Layout>
            <HeadBox title="Products" />
            <InvestMenu />
            <InvestProducts />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
