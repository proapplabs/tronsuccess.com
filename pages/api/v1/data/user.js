
import jwt from 'jsonwebtoken';
const key = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEG";
import { systemTime, percent, getDollar, getDomainRatesCalc, qrLink, getPrice } from '@utils/v1/func'
import { pass } from '@utils/v1/crypt'
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getTrx } from '@utils/v1/tron'
import { getUserTokenDB, getDomainTokenDB, getUserLevels, requestCountDB, userWalletControl, getFixedNotificationDB } from '@utils/v1/supabase'
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
            let domain = await getDomainTokenDB(DOMAIN_TOKEN)
            let user = await getUserTokenDB(USER_TOKEN)
            if (user && domain) {
                // User Datas
                const domainID = domain.id
                let domainName = domain.domain
                const domainWallet = JSON.parse(pass(domain.wallet, false))
                const domainWalletAddress = domainWallet.address
                const domainBasicView = domain.basic_view
                const domainPromotionView = domain.promotion_view
                const domainRate = domain.mining_rate

                const user_id = user.id
                const withdrawalCount = await requestCountDB('requests_withdrawal', user_id)

                account.user.onesignal = domainID + '.' + user_id
                // User Wallet Address Datas 
                let userBasic = null
                let userBasicAddress = null
                let userBasicAccount = {
                    trx: domainBasicView,
                    usd: getDollar(domainBasicView * 0.06237),
                    limit: {
                        min: 0,
                        min_trx: 0,
                        max: 0,
                        max_trx: 0,
                    },
                    address: null,
                    qr: null,
                    status: false
                }
                if (user.wallet) {
                    userBasic = JSON.parse(pass(user.wallet, false))
                    userBasicAddress = userBasic.address
                    const userBasicTotal = user.basic_total
                    const userBasicTotalTrx = user.basic_total_trx
                    const userBasicViewTotal = Number(userBasicTotal) + Number(domainBasicView)
                    const userBasicMin = domain.basic_investment_limit
                    userBasicAccount = {
                        trx: getPrice(userBasicViewTotal + user.trading_total),
                        usd: getDollar(userBasicViewTotal * 0.06237),
                        limit: {
                            min: userBasicMin,
                            min_trx: getPrice(getTrx(userBasicMin)),
                            max: getPrice(getDomainRatesCalc(domain.rates, userBasicTotal).amount),
                            max_trx: getPrice(percent(getTrx(userBasicTotalTrx), domainRate))
                        },
                        address: userBasicAddress,
                        qr: qrLink(userBasicAddress),
                        status: user.basic_total ? true : false
                    }
                }
                if (withdrawalCount != 0) {
                    userBasicAccount.limit.max = "0.00"
                }
                // User Promotion Address Datas
                let userPromotion = null
                let userPromotionAddress = null
                let userPromotionAccount = {
                    trx: getPrice(domainPromotionView),
                    usd: getDollar(domainPromotionView * 0.06237),
                    limit: {
                        min: 0,
                        min_trx: 0,
                        max: 0,
                        max_trx: 0
                    },
                    address: null,
                    qr: null
                }
                if (!user.promotion) {
                    user = await userWalletControl(user_id, user, 'promotion')
                }
                if (user.promotion) {
                    userPromotion = JSON.parse(pass(user.promotion, false))
                    userPromotionAddress = userPromotion.address
                    const userPromotionTotal = user.promotion_total
                    const userPromotionTotalTrx = user.basic_total_trx
                    const userPromotionViewTotal = Number(userPromotionTotal) + Number(domainPromotionView)
                    const userPromotionMin = domain.promotion_investment_limit
                    userPromotionAccount = {
                        trx: getPrice(userPromotionViewTotal),
                        usd: getDollar(userPromotionViewTotal * 0.06237),
                        limit: {
                            min: userPromotionMin,
                            min_trx: getPrice(getTrx(userPromotionMin)),
                            max: getPrice(userPromotionTotal),
                            max_trx: getPrice(percent(getTrx(userPromotionTotalTrx), domainRate))
                        },
                        address: userPromotionAddress,
                        qr: qrLink(userPromotionAddress)
                    }
                }
                if (withdrawalCount != 0) {
                    userPromotionAccount.limit.max = "0.00"
                }
                // // Level Control
                // if (!user.level_1 || !user.level_2 || !user.level_3) {
                //     user = await getUserLevels(user.id)
                // }
                account.user.basic_total = getPrice(user.basic_total + user.trading_total)
                account.user.promotion_total = getPrice(user.promotion_total)

                account.user.balance = {
                    basic: {
                        total: getPrice(user.basic_total),
                        trx: user.basic_total_trx,
                    },
                    promotion: {
                        total: getPrice(user.promotion_total),
                        trx: user.promotion_total_trx,
                    }
                }
                let inviteCode = user.invite_code
                // Fixed Notifications
                let notifications = await getFixedNotificationDB(domainID, true)

                // Results
                const shareLink = "https://" + domainName + "/register/" + inviteCode

                let data = {
                    telegram: {
                        support: domain.telegram_support,
                        official: domain.telegram
                    },
                    scam: user.scam_status,
                    user_status: user.status,
                    lastUpdated: new Date(),
                    account,
                    lang: "en",
                    miningRate: Number(getDomainRatesCalc(domain.rates, user.basic_total).rate) + Number(6),
                    totalBallance: Number(userBasicAccount.trx) + Number(userPromotionAccount.trx), // + Number(user.trading_total)
                    accounts: {
                        trading_total: user.trading_total,
                        basic: userBasicAccount,
                        promotion: userPromotionAccount
                    },
                    notifications,
                    share: {
                        link: shareLink,
                        imageLink: qrLink(shareLink)
                    },
                    time: systemTime(),
                    login: true,
                    limits: {
                        invest: {
                            basic: {
                                min: domain.basic_investment_limit
                            },
                            promotion: {
                                min: domain.promotion_investment_limit
                            }
                        },
                        withdrawal: {
                            basic: {
                                min: domain.basic_withdrawal_min_limit,
                                max: domain.basic_withdrawal_max_limit
                            },
                            promotion: {
                                min: domain.promotion_withdrawal_min_limit,
                                max: domain.promotion_withdrawal_max_limit
                            }
                        },
                    },
                    page: {
                        invest: {
                            minutes: "5~10",
                            min_amount: 5,
                            unit: "TRX"
                        }
                    },
                    system: {
                        title: domain.name,
                        description: domain.description
                    }
                }
                // console.log(user)
                // console.log(data)
                res.status(200).json(data)
            } else {
                res.status(203).json({ error: "You are not authorized for this operation. CODE:2003" })
            }

        } else {
            res.status(203).json({
                DOMAIN_TOKEN_DECODE,
                USER_TOKEN_DECODE,
                error: "You are not authorized for this operation.CODE:2002"
            })
        }
    } else {
        res.status(203).json({ error: "An unexpected error has occurred.CODE:2001", exit: true })
    }
}