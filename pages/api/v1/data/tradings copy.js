
import jwt from 'jsonwebtoken';
const key = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEG";
import { getDomainRatesCalc6, priceTrx } from '@utils/v1/func'
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, getDomainTokenDB, getTradingUserAllDB, requestCountDB } from '@utils/v1/supabase'
import { getTrx } from '@utils/v1/tron';
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    const { account } = req.body
    // res.status(203).json({ error: "You are not authorized for this operation. CODE:2003" })
    if (account) {
        // System Token 
        const CORE_KEY = process.env.PRIVATE_AUTH_KEY
        // Domain Token 
        const DOMAIN_TOKEN = getApiKey(req, res)
        const DOMAIN_TOKEN_DECODE = jwt.verify(DOMAIN_TOKEN, CORE_KEY);
        // User Token
        const USER_TOKEN = account.user.token
        const USER_TOKEN_DECODE = jwt.verify(USER_TOKEN, CORE_KEY);
        if (DOMAIN_TOKEN_DECODE.name == USER_TOKEN_DECODE.sub) {
            let domain = await getDomainTokenDB(DOMAIN_TOKEN)
            let basic_view = domain.basic_view
            let user = await getUserTokenDB(USER_TOKEN)
            if (user && domain) {
                const domainRate = domain.mining_rate
                const user_id = user.id
                const basic_total = user.basic_total
                const rates = domain.rates
                const daily_amount = getDomainRatesCalc6(rates, basic_total).amount // + basic_view + basic_total
                const domain_id = domain.id
                const items = await getTradingUserAllDB(user_id)
                let result = {
                    user: {
                        basic_total: user.basic_total
                    },
                    rates,
                    tradings: [],
                    total: {
                        receive: 0,
                        received: 0,
                        amount: 0
                    },
                    daily_amount
                }
                const miningTotal = await requestCountDB('requests_trading', user_id)
                let tradings = []
                if (!miningTotal) {
                    result.tradings = [
                        {
                            amount: daily_amount,
                            content: 'Quantifying transaction revenue',
                            status: false,
                            button: "Receive"
                        }
                    ]
                }


                items.map((v, i) => {
                    result.total.received = Number(result.total.received) + Number(1)
                    result.total.amount = Number(result.total.received) + Number(v.amount)
                    result.tradings = [...result.tradings, {
                        amount: v.amount,
                        content: 'Quantifying transaction revenue',
                        status: true,
                        button: "Received"
                    }];
                })
                res.status(200).json(result)
            } else {
                res.status(203).json({ error: "You are not authorized for this operation. CODE:2003" })
            }

        } else {

            res.status(203).json({ error: "You are not authorized for this operation.CODE:2002" })
        }
    } else {
        res.status(203).json({ error: "An unexpected error has occurred.CODE:2001", exit: true })
    }
}