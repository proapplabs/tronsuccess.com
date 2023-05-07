
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, insertDB, getDomainTokenDB, requestCountDB, visitorDB } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt'
import { getPrice, percent, systemTime } from '@utils/v1/func'
import { isAddress } from '@utils/v1/tron'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let { account, address, action, amount, password, visitor } = req.body
    if (account && address && action && amount && password && visitor) {
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
                // console.log(user)
                let withdrawal_status = false
                if (action == 'basic') {
                    withdrawal_status = user.permission_basic_withdrawal
                }
                if (action == 'promotion') {
                    withdrawal_status = user.permission_promotion_withdrawal
                }
                if (withdrawal_status) {
                    if (user) {
                        // amount = amount.replace('+', '')
                        const user_id = user.id
                        const domain_id = user.domain_id
                        const basic_total = user.basic_total
                        const promotion_total = user.promotion_total
                        let max_amount = null
                        if (action == 'basic') {
                            max_amount = getPrice(basic_total / 100 * domainRate)
                        } else if (action == 'promotion') {
                            max_amount = promotion_total
                        }
                        const min_amount = 0.01;
                        let payment_status = false
                        max_amount = parseInt(max_amount)
                        amount = parseInt(amount)
                        if (amount >= min_amount && amount <= max_amount) {
                            if (amount >= max_amount) {
                                payment_status = true
                                // console.log("1")
                            } else {
                                payment_status = false
                                // console.log("2")
                            }
                        } else {
                            payment_status = false
                            // console.log("3")
                        }
                        if (max_amount == null) {
                            res.status(203).json({ error: "Your user information cannot be accessed. Please login to your account again." })
                        } else {
                            const min_amount = 0.01;
                            if (payment_status) {
                                const password_secret = user.password_secret;
                                if (password_secret == pass(password, 'pass')) {
                                    const requestCount = await requestCountDB('requests_withdrawal', user_id)
                                    if (requestCount) {
                                        res.status(203).json({
                                            error: "You have made your daily withdrawal. Time remaining to your new withdrawal: " + systemTime().remaining_text
                                        })
                                    } else {
                                        if (address.substr(0, 1) == 'T') {
                                            const addressControl = await isAddress(address)
                                            if (addressControl) {
                                                const add = await insertDB('requests_withdrawal', {
                                                    user_id,
                                                    domain_id,
                                                    address,
                                                    amount,
                                                    action,
                                                    date: systemTime().date_system
                                                })
                                                const logAdd = await visitorDB({
                                                    action: "withdrawal_" + action,
                                                    log: visitor,
                                                    user_id,
                                                    domain_id
                                                });
                                                if (add) {
                                                    res.status(200).json({
                                                        data: " Your withdrawal request has been initiated."
                                                    })

                                                } else {
                                                    res.status(203).json({
                                                        error: "You are not authorized for this operation."
                                                    })
                                                }
                                            } else {
                                                res.status(203).json({
                                                    error: "Your wallet address is invalid."
                                                })
                                            }
                                        } else {
                                            res.status(203).json({
                                                error: "Please enter an address starting with T."
                                            })
                                        }
                                    }
                                } else {
                                    res.status(203).json({
                                        error: "Your security password is incorrect."
                                    })
                                }
                            } else {
                                res.status(203).json({
                                    error: "Your balance is insufficient."
                                })
                            }
                        }
                    } else {
                        res.status(203).json({
                            error: "You are not authorized for this operation.",
                        })
                    }
                } else {
                    res.status(203).json({ error: "Your withdrawal has been blocked. Contact the support team." })
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