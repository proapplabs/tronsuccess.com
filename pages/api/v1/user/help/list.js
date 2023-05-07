
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, getDomainTokenDB, getTableUserIdDB } from '@utils/v1/supabase'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    const { account } = req.body
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
            let user = await getUserTokenDB(USER_TOKEN)
            if (user && domain) {
                const user_id = user.id
                const domain_id = domain.id
                let datas = await getTableUserIdDB("requests_help", user_id)
                res.status(200).json({
                    items: datas
                })
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