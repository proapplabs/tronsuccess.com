
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, insertDB, getDomainTokenDB, getUserBonusCountDB } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let {
        token,
        account,
        amount,
        total_users,
        password,
        message
    } = req.body
    if (account && total_users && password && amount && message && password) {
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
                // User Datas
                let user = await getUserTokenDB(USER_TOKEN)
                if (user) {
                    const user_id = user.id
                    const domain_id = user.domain_id
                    const password_secret = user.password_secret
                    if (password_secret == pass(password, "pass")) {
                        // Action log save
                        const totalRequest = await getUserBonusCountDB(user_id, false)
                        if (totalRequest) {
                            res.status(203).json({
                                error: "You have a pending request. After your request is finalized, you can create a new request."
                            })
                        } else {
                            const requestSave = await insertDB('requests_bonus', {
                                user_id,
                                domain_id,
                                amount,
                                total_users,
                                message
                            })
                            if (requestSave) {
                                res.status(200).json({
                                    data: "Your bonus request has been created." + totalRequest
                                })
                            } else {
                                res.status(203).json({
                                    error: "Your transaction could not be completed due to congestion. Please try again."
                                })
                            }
                        }


                    } else {
                        res.status(203).json({
                            error: "Your security password is incorrect. Please try again."
                        })
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