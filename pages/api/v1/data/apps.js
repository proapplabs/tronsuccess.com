
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getDomainTokenDB } from '@utils/v1/supabase'
import { qrLink } from '@utils/v1/func'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let { account } = req.body
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
            const domain = await getDomainTokenDB(DOMAIN_TOKEN)
            if (domain) {
                let apps = []
                if (domain.app_android) {
                    apps = [...apps, {
                        title: "Android",
                        content: "You can access the Android mobile application by clicking the QR or button.",
                        app: domain.app_android,
                        qr: qrLink(domain.app_android),
                        button: "android"
                    }]
                } else {
                    apps = [...apps, {
                        title: "Android",
                        content: "You can access the Android mobile application by clicking the QR or button.",
                        app: null,
                    }]
                }
                if (domain.app_ios) {
                    apps = [...apps, {
                        title: "Ios",
                        content: "You can access the IOS mobile application by clicking the QR or button.",
                        app: domain.app_ios,
                        qr: qrLink(domain.app_ios),
                        button: "ios"
                    }]
                } else {
                    apps = [...apps, {
                        title: "Ios",
                        content: "You can access the IOS mobile application by clicking the QR or button.",
                        app: null,
                    }]
                }
                res.status(203).json({ apps })
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