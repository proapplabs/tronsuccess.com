import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import InvestMenu from '@components/invest/investMenu'
import MiningList from '@components/invest/miningList'
import HeadBox from '@components/headBox'
import useTranslation from 'next-translate/useTranslation'

export default function InvestList({ datas }) {
    const { t, lang } = useTranslation('common');
    return (
        <Layout>
            <HeadBox title="Invest List" />
            <InvestMenu />
            <MiningList />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
