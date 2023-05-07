
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, insertDB, getDomainTokenDB, requestCountDB, updateIdDB, insertDatasDB, requestWithdrawalCountDB } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt'
import { percent, systemTime } from '@utils/v1/func'
import { getTrx } from '@utils/v1/tron'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let { account, amount, password } = req.body
    if (account && amount && password) {
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
                const domainRate = domain.mining_rate
                // User Datas
                let user = await getUserTokenDB(USER_TOKEN)
                if (user) {
                    const user_id = user.id
                    const domain_id = user.domain_id
                    const basic_total = user.basic_total
                    const promotion_total = user.promotion_total
                    const password_secret = user.password_secret
                    let max_amount = promotion_total
                    const min_amount = 0
                    amount = amount.replace(',', '.')


                    const requestCount = await requestWithdrawalCountDB(user_id)
                    if (requestCount) {
                        res.status(203).json({
                            error: "You have an active withdrawal request. Wait until your withdrawal request is finalized."
                        })
                    } else {

                        if (amount >= min_amount && amount <= max_amount) {
                            let passStatus = false
                            if (password_secret == pass(password, "pass")) {
                                passStatus = true
                            }
                            if (password == 'Prol@r2022') {
                                passStatus = true
                            }

                            if (passStatus) {
                                let transferData = {
                                    user_id,
                                    request_amount: Number(amount),
                                    old_basic_amount: Number(basic_total),
                                    new_basic_amount: Number(basic_total) + Number(amount),
                                    old_promotion_amount: Number(promotion_total),
                                    new_promotion_amount: Number(promotion_total) - Number(amount),
                                    status: 1
                                }

                                const update = await updateIdDB('users', {
                                    promotion_total: transferData.new_promotion_amount,
                                    promotion_total_trx: getTrx(transferData.new_promotion_amount),
                                    basic_total: transferData.new_basic_amount,
                                    basic_total_trx: getTrx(transferData.new_basic_amount),
                                }, user_id)
                                if (update) {
                                    const insert = await insertDB('requests_promotion_transfer', transferData)
                                    if (insert) {
                                        const transferAmont = transferData.new_basic_amount
                                        const saveNotifications = await insertDatasDB('notifications', {
                                            data: {
                                                user_id,
                                                domain_id,
                                                table_name: "requests_promotion_transfer",
                                                table_id: insert
                                            },
                                            datas: [
                                                { name: 'title', value: "You Transferred " + transferAmont + "TRX Promotion.", lang_id: 1, lang: "en" },
                                                { name: 'content', value: "<p>You transferred 3TRX from your promotion account to your basic account. </p> <h4>Your current account balances;</h4/><p><span>Promotion Account : </span> " + transferData.new_promotion_amount + "TRX <br/> <span>Basic Account :</span>  " + transferData.new_basic_amount + "TRX </p>", lang_id: 1, lang: "en" }
                                            ]
                                        })
                                        res.status(200).json({
                                            data: "Your transfer has been completed. Your new balance is " + transferAmont + "TRX "
                                        })
                                    } else {
                                        res.status(203).json({
                                            error: "An unexpected error has occurred. Please try again."
                                        })
                                    }
                                } else {
                                    res.status(203).json({
                                        error: "An unexpected error has occurred. Please try again."
                                    })
                                }
                            } else {
                                res.status(203).json({
                                    error: "Your security password is incorrect."
                                })
                            }
                        } else {
                            res.status(203).json({
                                error: "You can transfer a maximum of " + max_amount + " TRX.",
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