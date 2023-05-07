import { userControl } from '@utils/crypt'
import Head from 'next/head'
import Layout from '@components/layout'
import CloudMiningIsWorking from '@components/trading/cloudMiningIsWorking'
import TradingProfit from '@components/trading/tradingProfit'
import { systemTime } from '@utils/func'
import { useEffect, useState } from 'react'
import HeadBox from '@components/headBox'
export default function Trading({ datas }) {
    const [date, setDate] = useState()

    return (
        <Layout>
            <HeadBox title="Recharge" />
            <CloudMiningIsWorking />
            <TradingProfit />
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
