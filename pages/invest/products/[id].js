import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import InvestProduct from '@components/invest/investProduct'
import HeadBox from '@components/headBox'
export default function Products({ datas }) {
    return (
        <Layout>
            <HeadBox title="Product Detail" />
            <InvestProduct />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
