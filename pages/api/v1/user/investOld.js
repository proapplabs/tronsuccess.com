
import jwt from 'jsonwebtoken';
const key = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEG";
import { systemTime, percent } from '@utils/v1/func'
import { pass } from '@utils/v1/crypt'
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { getUserTokenDB, getDomainTokenDB, insertDB, transferInsertDB, updateIdDB, getUserLevels } from '@utils/v1/supabase'
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
            const domainID = domain.id
            let domainName = domain.domain
            // domainName = "metron.vercel.app" 
            const domainWallet = JSON.parse(pass(domain.wallet, false))
            let domainWalletAddress = domainWallet.address
            const domainWalletAddressKey = domainWallet.privateKey
            // console.log('domain ' + domainWalletAddress)
            // User Datas
            let user = await getUserTokenDB(USER_TOKEN)
            const userID = user.id
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
            // TRON 
            const userTrxBalanceControl = await getBalance(address);
            // console.log(userTrxBalanceControl)
            if (action == 'basic') {
                const userAmountUpdateDB = updateIdDB('users', {
                    basic_balance: userTrxBalanceControl['convert'],
                    basic_balance_trx: userTrxBalanceControl['ballance']
                }, userID)
                userAddress = userBasicAddress
                userAddressKey = userBasicAddressKey
            }
            if (action == 'promotions') {
                const userAmountUpdateDB = updateIdDB('users', {
                    promotion_balance: userTrxBalanceControl['convert'],
                    promotion_balance_trx: userTrxBalanceControl['ballance']
                }, userID)
                userAddress = userPromotionAddress
                userAddressKey = userPromotionAddressKey
            }
            if (userTrxBalanceControl['convert'] >= 5) {
                if (userAddress && userAddressKey) {
                    let amount = userTrxBalanceControl.ballance

                    // Reset Balance of User Address 
                    const trxSend = await trxSendTill(userAddress, userAddressKey, domainWalletAddress, amount)
                    // console.log(trxSend)
                    if (trxSend.result) {
                        const resetUserBalanceAddDB = await transferInsertDB({
                            user_id: userID,
                            domain_id: domainID,
                            from_address: userAddress,
                            to_address: domainWalletAddress,
                            amount: userTrxBalanceControl['convert'],
                            amount_trx: userTrxBalanceControl['ballance'],
                            result_txid: trxSend.txid,
                            result_status: trxSend.result,
                            action: "reset",
                            result: trxSend
                        })
                        if (resetUserBalanceAddDB) {
                            // console.log('transfers insert : ' + resetUserBalanceAddDB)
                            // User Add Accounts 
                            const userAccountAddDB = await insertDB('users_accounts', {
                                user_id: userID,
                                domain_id: domainID,
                                account: action,
                                action: "incoming",
                                amount: userTrxBalanceControl['convert'],
                                amount_trx: userTrxBalanceControl['ballance'],
                                transfer_id: resetUserBalanceAddDB
                            })
                            // console.log('users_accounts insert: ' + userAccountAddDB)
                        }

                        // User Add Amount
                        let userNewTrxBalanceControl = await getBalance(address);
                        // console.log(userNewTrxBalanceControl)
                        // User Add Amount
                        if (action == 'basic') {
                            const oldBalance = Number(user.basic_total)
                            const newBalance = Number(userNewTrxBalanceControl['convert'])
                            const oldTrxBalance = Number(user.basic_total_trx)
                            const newTrxBalance = Number(userNewTrxBalanceControl['ballance'])
                            const newTotalBalance = oldBalance + newBalance
                            const newTrxTotalBalance = oldTrxBalance + newTrxBalance
                            const userAmountUpdateDB = await updateIdDB('users', {
                                basic_balance: newBalance,
                                basic_balance_trx: newTrxBalance,
                                basic_total: newTotalBalance,
                                basic_total_trx: newTrxTotalBalance,
                            }, userID)
                        }
                        if (action == 'promotions') {
                            const oldBalance = Number(user.promotion_total)
                            const newBalance = Number(userNewTrxBalanceControl['convert'])
                            const oldTrxBalance = Number(user.promotion_total_trx)
                            const newTrxBalance = Number(userNewTrxBalanceControl['ballance'])
                            const newTotalBalance = oldBalance + newBalance
                            const newTrxTotalBalance = oldTrxBalance + newTrxBalance
                            const userAmountUpdateDB = await updateIdDB('users', {
                                promotion_balance: newBalance,
                                promotion_balance_trx: newTrxBalance,
                                promotion_total: newTotalBalance,
                                promotion_total_trx: newTrxTotalBalance,
                            }, userID)
                        }
                        // Results 
                        res.status(200).json({
                            data: "Your " + userTrxBalanceControl.convert + " transfer has been completed."
                        })
                    } else {
                        // console.log(data)
                        res.status(203).json({
                            error: "An unexpected error has occurred in your account information."
                        })
                    }
                } else {

                }
            } else {
                // console.log(data)
                //  CODE:1003
                res.status(203).json({
                    error: "Your transfer is awaited. Please try again later.",
                    userBasic,
                    address,
                    userPromotion,
                    domainWallet
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