import { getBalance, trxSendTill, tronSend, isAddress, tester } from '@utils/v1/tron';
import TronWeb from "tronweb";
// import { testTron } from '@utils/v1/api';
import { getUserLevels } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt';
import { systemTime } from '@utils/v1/func';

export default async function handler(req, res) {

    // const address = 'TU25tSe1WS63fhfBbgZfwGPJL6T7WhpjUb'
    // const userTrxBalanceControl = await getBalance(address)
    // if (userTrxBalanceControl['convert'] >= 5) {
    //     res.status(200).json({
    //         status: "ok",
    //         levels: userTrxBalanceControl
    //     })
    // } else {
    //     res.status(200).json({
    //         status: "false",
    //         levels: userTrxBalanceControl['convert']
    //     })
    // }

    res.status(203).json({
        a: await tester()
    })
    // res.status(203).json({
    //     a: await isAddress('TNbgZ1bWQcWr3uw4HHwUz7K9w39c5PNMya')
    // })
    /*
    const userWalletAddress = "TVCdECPKJbEPRy53dR9sTWc8fKiqdK89ha"
    const userWalletAddressKey = "2B422EA087D3AA236C2C9574A087195BAE9C29BA43B9A1556F1E7035C2926605"
    const domainWalletAddress = "TCW9U5rdcfi9xPYPYaCoKtTxxvonjHYA4u"
    const userTrxBalanceControl = await getBalance(userWalletAddress);
    const amount = userTrxBalanceControl.ballance
    // const amount = TronWeb.toSun(5)
    let trxSend = "null"
    if (userTrxBalanceControl) {
        trxSend = await trxSendTill(userWalletAddress, userWalletAddressKey, domainWalletAddress, amount)
    } 
    res.status(203).json({
        send: trxSend,
        result: userTrxBalanceControl
    })
    */
}

/*
TEST : TRkKSEzwj7b1sasn8LxkACpgSacJbbWMUH
ABDULLAH : TZEJvr4cc4JiE8repgYSZUDWqMG3kPVJWP


*/


