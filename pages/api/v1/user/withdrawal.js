
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, insertDB, getDomainTokenDB, requestCountDB, visitorDB, getUserWithdrawalCalc } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt'
import { getDomainRatesCalc, getPrice, percent, systemTime } from '@utils/v1/func'
import { isAddress } from '@utils/v1/tron'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let { account, address, action, amount, password, visitor } = req.body
    if (account && address && action && amount && password && visitor) {
        amount = amount.replace("/", "")
        amount = amount.replace("-", "")
        amount = amount.replace("+", "")
        amount = amount.replace(",", ".")
        amount = Number(amount)


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
                let domain_min_balance = 5
                if (domain.rates) {
                    domain_min_balance = domain.rates[0].min
                }
                // User Datas
                let user = await getUserTokenDB(USER_TOKEN)
                // console.log(user)
                let withdrawal_status = false
                let day_status = false
                let user_day_total = 0
                let domain_day_total = 0
                const domain_basic_withdrawal_day_limit = domain.basic_withdrawal_day_limit
                const domain_promotion_withdrawal_day_limit = domain.promotion_withdrawal_day_limit
                const user_basic_withdrawal_total_day = user.basic_withdrawal_total_day
                const user_promotion_withdrawal_total_day = user.promotion_withdrawal_total_day


                if (user.rosette == true) {
                    day_status = true
                    withdrawal_status = true
                } else {
                    if (action == 'basic') {
                        domain_day_total = domain_basic_withdrawal_day_limit
                        user_day_total = user_basic_withdrawal_total_day
                        withdrawal_status = user.permission_basic_withdrawal
                        if (domain_basic_withdrawal_day_limit >= user_basic_withdrawal_total_day) {
                            day_status = true
                        }
                    }
                    if (action == 'promotion') {
                        domain_day_total = domain_promotion_withdrawal_day_limit
                        withdrawal_status = user.permission_promotion_withdrawal
                        user_day_total = user_promotion_withdrawal_total_day
                        if (domain_promotion_withdrawal_day_limit >= user_promotion_withdrawal_total_day) {
                            day_status = true
                        }
                    }
                }
                if (withdrawal_status) {
                    if (user) {
                        // amount = amount.replace('+', '')
                        const user_id = user.id
                        const domain_id = user.domain_id
                        const basic_total = user.basic_total
                        const promotion_total = user.promotion_total

                        if (basic_total >= domain_min_balance) {
                            let min_amount = 0.01;
                            let max_amount = null
                            if (action == 'basic') {
                                min_amount = domain.basic_withdrawal_min_limit
                                max_amount = getDomainRatesCalc(domain.rates, basic_total).amount
                            } else if (action == 'promotion') {
                                min_amount = domain.promotion_withdrawal_min_limit
                                max_amount = promotion_total
                            }
                            max_amount = Number(max_amount)
                            amount = Number(amount)
                            if (max_amount == null) {
                                res.status(203).json({ error: "Your user information cannot be accessed. Please login to your account again." })
                            } else {
                                let result = {}
                                if (amount >= min_amount && amount <= max_amount) {
                                    const password_secret = user.password_secret;
                                    if (password_secret == pass(password, 'pass')) {
                                        const requestCount = await requestCountDB('requests_withdrawal', user_id)
                                        if (requestCount == 0) {
                                            if (address.substr(0, 1) == 'T') {
                                                const addressControl = await isAddress(address)
                                                if (addressControl) {
                                                    let withdrawal_data = {
                                                        user_id,
                                                        domain_id,
                                                        address,
                                                        amount,
                                                        action,
                                                        date: systemTime().date_system
                                                    }
                                                    // if (day_status == false) {
                                                    //     withdrawal_data.day_domain = domain_day_total
                                                    //     withdrawal_data.day_user = user_day_total
                                                    //     withdrawal_data.error = true
                                                    //     withdrawal_data.errors = {
                                                    //         "error": "User Total Withdrawal Limit : " + user_day_total + " Day. Project Total Withdrawal Limit : " + domain_day_total + ' Day. Action : ' + action
                                                    //     }
                                                    // }
                                                    result = {
                                                        day_status,
                                                        withdrawal_data,
                                                        error: "test"
                                                    }
                                                    const add = await insertDB('requests_withdrawal', withdrawal_data)
                                                    if (add) {
                                                        result = {
                                                            data: " Your withdrawal request has been initiated."
                                                        }
                                                        let userCalcUpdate = await getUserWithdrawalCalc(user_id);
                                                    } else {
                                                        result = {
                                                            error: "You are not authorized for this operation."
                                                        }
                                                    }
                                                } else {
                                                    result = {
                                                        error: "Your wallet address is invalid."
                                                    }
                                                }
                                            } else {
                                                result = {
                                                    error: "Please enter an address starting with T."
                                                }
                                            }
                                        } else {
                                            result = {
                                                error: "You have made your daily withdrawal. Time remaining to your new withdrawal: " + systemTime().remaining_text
                                            }
                                        }
                                    } else {
                                        result = {
                                            error: "Your security password is incorrect."
                                        }
                                    }
                                } else {
                                    result = {
                                        error: "You cannot shoot below " + domain_min_balance + ". Please add balance."
                                    }
                                }
                                // RETURN RESULT 
                                if (result.data) {
                                    res.status(200).json(result)
                                } else {
                                    res.status(203).json(result)
                                }
                                // ADD LOG
                                if (result.data) {
                                    visitor.note_status = "Success"
                                    visitor.note = result.data
                                } else {
                                    visitor.note = result.error
                                    visitor.note_status = "Error"
                                }
                                const logAdd = await visitorDB({
                                    action: "withdrawal_" + action,
                                    log: visitor,
                                    user_id,
                                    domain_id
                                });
                            }
                        } else {
                            res.status(203).json({
                                error: "To withdraw the promotional balance, you need to make a minimum deposit of " + domain_min_balance + " TRX basic account."
                            })
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