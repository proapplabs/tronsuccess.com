import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import InvestForm from '@components/invest/investForm'
import HeadBox from '@components/headBox'
import { useRouter } from "next/router";
import { capitalize } from '@utils/func';
export default function Home({ datas }) {
    const router = useRouter()
    const { action } = router.query
    return (
        <Layout>
            <HeadBox title={capitalize(action) + ' Recharge'} />
            <InvestForm />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
