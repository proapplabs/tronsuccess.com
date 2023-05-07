
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, insertDB, getDomainTokenDB, getUserBonusCountDB } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt'
import { percent, systemTime } from '@utils/v1/func'
import { getTrx } from '@utils/v1/tron'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let {
        token,
        account,
        subject,
        message
    } = req.body
    if (account && subject && message) {
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
                    const requestSave = await insertDB('requests_help', {
                        user_id,
                        domain_id,
                        subject,
                        message
                    })
                    if (requestSave) {
                        res.status(200).json({
                            data: "Your help request has been created."
                        })
                    } else {
                        res.status(203).json({
                            error: "Your transaction could not be completed due to congestion. Please try again."
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