
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, insertDB, getDomainTokenDB, requestCountDB, updateIdDB, insertDatasDB } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt'
import { percent, systemTime } from '@utils/v1/func'
import { getTrx } from '@utils/v1/tron'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    let { account, action, oldPass, newPass, newPassConfirm } = req.body
    if (account && action && newPass && oldPass && newPassConfirm) {
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
                    const password = user.password
                    const password_secret = user.password_secret
                    if (action == 'password') {
                        if (password == pass(oldPass, "pass")) {
                            const update = await updateIdDB('users', {
                                password: pass(newPass, 'pass')
                            }, user_id)
                            if (update) {
                                // Action log save
                                const requestSave = await insertDB('requests_password', {
                                    user_id,
                                    old_pass: oldPass,
                                    new_pass: newPass
                                })
                                // Action log save
                                const saveNotifications = await insertDatasDB('notifications', {
                                    data: {
                                        user_id,
                                        domain_id,
                                        table_name: "requests_password",
                                        table_id: requestSave
                                    },
                                    datas: [
                                        { name: 'title', value: 'Security Alert', lang_id: 1, lang: "en" },
                                        { name: 'content', value: 'Password changed', lang_id: 1, lang: "en" }
                                    ]
                                })
                                // Success Mesage 
                                res.status(200).json({
                                    data: "Your  password has been updated."
                                })
                            } else {
                                res.status(203).json({
                                    error: "An error occurred while updating your new  password. Please try again."
                                })
                            }
                        } else {
                            res.status(203).json({
                                error: "Your old password is incorrect"
                            })
                        }
                    } else {
                        if (password_secret == pass(oldPass, "pass")) {
                            const update = await updateIdDB('users', {
                                password_secret: pass(newPass, 'pass')
                            }, user_id)
                            if (update) {
                                // Action log save
                                const requestSave = await insertDB('requests_password', {
                                    user_id,
                                    old_pass: oldPass,
                                    new_pass: newPass
                                })
                                // Action log save
                                const saveNotifications = await insertDatasDB('notifications', {
                                    data: {
                                        user_id,
                                        domain_id,
                                        table_name: "requests_password",
                                        table_id: requestSave
                                    },
                                    datas: [
                                        { name: 'title', value: 'Security Alert', lang_id: 1, lang: "en" },
                                        { name: 'content', value: 'Secret password changed', lang_id: 1, lang: "en" }
                                    ]
                                })
                                // Success Mesage 
                                res.status(200).json({
                                    data: "Your secret password has been updated."
                                })
                            } else {
                                res.status(203).json({
                                    error: "An error occurred while updating your new secret password. Please try again."
                                })
                            }
                        } else {
                            res.status(203).json({
                                error: "Your old secret password is incorrect"
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