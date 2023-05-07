
import jwt from 'jsonwebtoken';
import { getDomainRatesCalc6 } from '@utils/v1/func'
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, insertDB, getDomainTokenDB, requestCountDB, updateIdDB } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt'
import { getPrice, percent, systemTime } from '@utils/v1/func'
import { getTrx } from '@utils/v1/tron';
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let { account, amount } = req.body
    // if (account && amount) {
    if (account && amount) {
        // System Token 
        const CORE_KEY = process.env.PRIVATE_AUTH_KEY
        // Domain Token 
        const DOMAIN_TOKEN = getApiKey(req, res)
        const DOMAIN_TOKEN_DECODE = jwt.verify(DOMAIN_TOKEN, CORE_KEY);
        // User Token
        const USER_TOKEN = account.user.token
        const USER_TOKEN_DECODE = jwt.verify(USER_TOKEN, CORE_KEY);
        if (DOMAIN_TOKEN_DECODE.name == USER_TOKEN_DECODE.sub) {
            const domain = await getDomainTokenDB(DOMAIN_TOKEN)
            if (domain) {
                let basic_view = domain.basic_view
                const rates = domain.rates
                const domainRate = domain.mining_rate + 6
                // User Datas
                let user = await getUserTokenDB(USER_TOKEN)
                if (user) {
                    const user_id = user.id
                    const domain_id = user.domain_id
                    const basic_total = user.basic_total
                    const trading_total = user.trading_total
                    const promotion_total = user.promotion_total
                    // const amount = percent(basic_total, domainRate)
                    const amount = getDomainRatesCalc6(rates, basic_view + basic_total).amount
                    const new_trading_total = trading_total + amount
                    const total = await requestCountDB('requests_trading', user_id)


                    if (total) {
                        res.status(203).json({
                            error: "You have reached your daily limit.",
                        })
                    } else {
                        const updateUser = await updateIdDB('users', {
                            trading_total: new_trading_total,
                            trading_total_trx: getTrx(new_trading_total)
                        }, user_id)
                        if (updateUser) {
                            const add = await insertDB('requests_trading', {
                                user_id,
                                domain_id,
                                date: systemTime().date_system,
                                trading_total,
                                new_trading_total,
                                amount,
                                basic_view,
                                basic_total
                            })

                            if (add) {
                                res.status(200).json({
                                    data: getPrice(amount) + "TRX has been transferred to your account.",
                                })
                            } else {
                                res.status(200).json({
                                    error: "An error has occurred, please try again."
                                })
                            }
                        } else {
                            res.status(200).json({
                                error: "An error has occurred, please try again."
                            })
                        }
                    }

                } else {
                    res.status(203).json({
                        error: "You are not authorized for this operation.",
                    })
                }

            } else {
                res.status(203).json({ error: "You are not authorized for this operation." })
            }
        } else {
            // CODE:1002
            res.status(203).json({ error: "You are not authorized for this operation." })
        }
    } else {
        // CODE:1001
        res.status(203).json({ error: "Your user information cannot be accessed. Please login to your account again." })
    }
}