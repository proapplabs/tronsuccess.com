
import jwt from 'jsonwebtoken';
const key = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEG";
import { systemTime } from '@utils/v1/func'
import { pass } from '@utils/v1/crypt'
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, getDomainTokenDB, insertDB, transferInsertDB, updateIdDB, addUserNotificationDB, rechargeAddDB } from '@utils/v1/supabase'
import { getBalance, trxSendTill } from '@utils/v1/tron';
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    const { account, address, action } = req.body
    if (account && address && action) {
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
            let domainName = domain.domain
            // domainName = "metron.vercel.app" 
            const domainWallet = JSON.parse(pass(domain.wallet, false))
            let domainWalletAddress = domainWallet.address
            const domainWalletAddressKey = domainWallet.privateKey
            // console.log('domain ' + domainWalletAddress)
            // User Datas
            let user = await getUserTokenDB(USER_TOKEN)
            const user_id = user.id
            const userBasic = JSON.parse(pass(user.wallet, false))
            const userBasicAddress = userBasic.address
            const userBasicAddressKey = userBasic.privateKey

            const userPromotion = JSON.parse(pass(user.promotion, false))
            const userPromotionAddress = userPromotion.address
            const userPromotionAddressKey = userPromotion.privateKey

            let inviteCode = user.invite_code
            let basicTrxAmount = domain.amount
            let promotionTrxAmount = 1500

            let userAddress = null
            let userAddressKey = null
            const rechargeControl = await rechargeAddDB(user_id, domain_id, action)
            // console.log(rechargeControl)
            // TRON 
            const userTrxBalanceControl = await getBalance(address);
            if (action == 'basic') {
                const userAmountUpdateDB = updateIdDB('users', {
                    basic_balance: userTrxBalanceControl['convert'],
                    basic_balance_trx: userTrxBalanceControl['ballance']
                }, user_id)
                userAddress = userBasicAddress
                userAddressKey = userBasicAddressKey
            }
            if (action == 'promotions') {
                const userAmountUpdateDB = updateIdDB('users', {
                    promotion_balance: userTrxBalanceControl['convert'],
                    promotion_balance_trx: userTrxBalanceControl['ballance']
                }, user_id)
                userAddress = userPromotionAddress
                userAddressKey = userPromotionAddressKey
            }
            if (userTrxBalanceControl['convert'] >= 5) {
                if (userAddress && userAddressKey) {
                    let amount = userTrxBalanceControl.ballance
                    const transferAmount = userTrxBalanceControl['convert']
                    const transferAmountTrx = userTrxBalanceControl['ballance']
                    // Reset Balance of User Address 
                    const trxSend = await trxSendTill(userAddress, userAddressKey, domainWalletAddress, amount)
                    if (trxSend.result) {
                        const resetUserBalanceAddDB = await transferInsertDB({
                            user_id: user_id,
                            domain_id: domain_id,
                            from_address: userAddress,
                            to_address: domainWalletAddress,
                            amount: transferAmount,
                            amount_trx: transferAmountTrx,
                            result_txid: trxSend.txid,
                            result_status: trxSend.result,
                            action: "reset",
                            result: trxSend
                        })
                        const saveNotifications = await addUserNotificationDB(
                            user,
                            "requests_withdrawal",
                            resetUserBalanceAddDB,
                            "Investment",
                            transferAmount + " TRX " + action + " investment was transferred."
                        )
                        // User Add Amount
                        let userNewTrxBalanceControl = await getBalance(address);
                        // User Add Amount
                        if (action == 'basic') {
                            const oldBalance = Number(user.basic_total)
                            const newBalance = Number(transferAmount)
                            const oldTrxBalance = Number(user.basic_total_trx)
                            const newTrxBalance = Number(transferAmountTrx)
                            const newTotalBalance = oldBalance + newBalance
                            const newTrxTotalBalance = oldTrxBalance + newTrxBalance
                            const userAmountUpdateDB = await updateIdDB('users', {
                                // basic_balance: newBalance,
                                // basic_balance_trx: newTrxBalance,
                                basic_total: newTotalBalance,
                                basic_total_trx: newTrxTotalBalance,
                            }, user_id)
                            // const add = await addUserPromotionDB(user, domain, transferAmount) 
                            const addLevel = await insertDB('requests_levels', {
                                user_id: user.id,
                                amount: transferAmount,
                                level_1_id: user.level_1,
                                level_2_id: user.level_2,
                                level_3_id: user.level_3,
                                domain_id: user.domain_id,
                                transfer_id: resetUserBalanceAddDB,
                                action: "promotions"
                            })
                        }
                        if (action == 'promotions') {
                            const oldBalance = Number(user.promotion_total)
                            const newBalance = Number(transferAmount)
                            const oldTrxBalance = Number(user.promotion_total_trx)
                            const newTrxBalance = Number(transferAmountTrx)
                            const newTotalBalance = oldBalance + newBalance
                            const newTrxTotalBalance = oldTrxBalance + newTrxBalance
                            const userAmountUpdateDB = await updateIdDB('users', {
                                // promotion_balance: newBalance,
                                // promotion_balance_trx: newTrxBalance,
                                promotion_total: newTotalBalance,
                                promotion_total_trx: newTrxTotalBalance,
                            }, user_id)
                        }

                        const addInvestments = await insertDB('investments', {
                            user_id: user_id,
                            amount: transferAmount,
                            domain_id: domain_id,
                            action: action,
                            transfer_id: resetUserBalanceAddDB,
                            date: systemTime().date_system,
                            time: systemTime().clock
                        })
                        // Results 
                        res.status(200).json({
                            data: "Transfer  has been completed."
                        })
                    } else {
                        // console.log(data)
                        res.status(203).json({
                            error: "An unexpected error has occurred in your account information."
                        })
                        const addInvestments = await insertDB('investments', {
                            user_id: user_id,
                            amount: transferAmount,
                            domain_id: domain_id,
                            action: action,
                            transfer_id: resetUserBalanceAddDB,
                            date: systemTime().date_system,
                            time: systemTime().clock
                        })
                    }
                } else {
                    const cronInvestment = await insertDB('cron_investments', {
                        user_id: user_id,
                        amount: transferAmount,
                        domain_id: domain_id,
                        action: action,
                        date: systemTime().date_system,
                        time: systemTime().clock
                    })

                    // if (result.data) {
                    //     visitor.note_status = "Success"
                    //     visitor.note = result.data
                    // } else {
                    //     visitor.note = result.error
                    //     visitor.note_status = "Error"
                    // }



                    // const logAdd = await visitorDB({
                    //     action: "withdrawal_" + action,
                    //     log: visitor,
                    //     user_id,
                    //     domain_id
                    // });
                    res.status(203).json({
                        error: "Your transfer is awaited. Please try again later."
                    })
                }
            } else {
                // console.log(data)
                //  CODE:1003
                res.status(203).json({
                    error: "Your transfer is awaited. Please try again later."
                })
            }
        } else {
            // CODE:1002
            res.status(203).json({ error: "You are not authorized for this operation." })
        }
    } else {
        // CODE:1001
        res.status(203).json({ error: "An unexpected error has occurred. " })
    }
}