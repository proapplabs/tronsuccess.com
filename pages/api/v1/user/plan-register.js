
import jwt from 'jsonwebtoken';
const key = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEG";
import { systemTime, percent, getPrice, addDate } from '@utils/v1/func'
import { pass } from '@utils/v1/crypt'
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, getDomainTokenDB, getDomainPlanIdDB, insertDB, updateIdDB } from '@utils/v1/supabase'
import { getBalance, getTrx, trxSendTill } from '@utils/v1/tron';
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let { account, id, amount, password } = req.body
    if (account && id && amount) {
        // Amount Control
        amount = amount.replace("*", "")
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
            // User Datas
            const domain = await getDomainTokenDB(DOMAIN_TOKEN)
            const domain_id = domain.id
            // User Datas
            let user = await getUserTokenDB(USER_TOKEN)
            const user_id = user.id
            const promotion_total = user.promotion_total

            let plan = await getDomainPlanIdDB(domain_id, id)
            if (plan) {
                const password_secret = user.password_secret
                if (password_secret == pass(password, "pass")) {
                    const plan_id = plan.id
                    const rate = plan.rate
                    const day = plan.crcle
                    const min_amount = plan.start_amount
                    const max_amount = plan.max_amount
                    const earning = getPrice((amount * rate * day) / 100)
                    const start_date = addDate(0)
                    const stop_date = addDate(day)
                    if (promotion_total >= min_amount && promotion_total <= max_amount) {
                        if (amount >= min_amount && amount <= max_amount) {
                            const add = await insertDB('requests_plan', {
                                plan_id,
                                domain_id,
                                user_id,
                                amount,
                                start_date,
                                stop_date,
                                earning
                            })
                            if (add) {
                                const newPromotionTotal = parseInt(promotion_total) - parseInt(amount)
                                const userUpdate = await updateIdDB('users', {
                                    promotion_total: newPromotionTotal,
                                    promotion_total_trx: getTrx(newPromotionTotal),
                                }, user_id)
                                res.status(203).json({
                                    data: "Your registration is successful."
                                })
                            } else {
                                res.status(203).json({
                                    error: "An error occurred during the registration process. Try again."
                                })
                            }
                        } else {
                            res.status(203).json({
                                error: "Your promotion balance is insufficient. Minimum of " + min_amount + " TRX."
                            })
                        }
                    } else {
                        res.status(203).json({
                            error: "  Your promotion balance is insufficient. Minimum of " + min_amount + " TRX."
                        })
                    }
                } else {
                    res.status(203).json({
                        error: "Your security password is incorrect. Please try again."
                    })
                }
            } else {
                res.status(203).json({
                    error: "The product was not found."
                })
            }
        } else {
            // CODE:1002
            res.status(203).json({ error: "You are not authorized for this operation." })
        }
    } else {
        // CODE:1001
        res.status(203).json({ error: "Fill in the Promotion account and security password fields." })
    }

}