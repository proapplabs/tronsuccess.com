
import jwt from 'jsonwebtoken';
const key = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEG";
import { systemTime, percent, getDollar, linkEncode, qrLink } from '@utils/v1/func'
import { pass } from '@utils/v1/crypt'
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getTrx } from '@utils/v1/tron'
import { getUserTokenDB, getDomainTokenDB, getUserLevels, updateIdDB, userWalletControl, getNotificationsDB, requestCountDB } from '@utils/v1/supabase'
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
        if (DOMAIN_TOKEN_DECODE.name == USER_TOKEN_DECODE.sub) {
            let domain = await getDomainTokenDB(DOMAIN_TOKEN)
            res.status(200).json({
                telegram: domain.telegram
            })
        } else {

            res.status(203).json({ error: "You are not authorized for this operation.CODE:2002" })
        }
    } else {
        res.status(203).json({ error: "An unexpected error has occurred.CODE:2001", exit: true })
    }
}