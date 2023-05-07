import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import TotalBallance from '@components/totalBallance'
import Balances from '@components/mine/balances'
import Profile from '@components/mine/profile'
import ButtonMenu from '@components/buttonMenu'
import HeadBox from '@components/headBox'
export default function Mine() {
    return (
        <Layout>
            <HeadBox title="Mine" />
            <TotalBallance />
            <Balances page="mine" />
            <div className="mineButtonBox">
                <ButtonMenu page="mine" />
            </div>
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
