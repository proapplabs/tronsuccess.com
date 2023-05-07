
import { getApi } from '@utils/api';
import { getAccountDatas } from '@utils/crypt';
import { vi } from '@utils/visitor';
export default async function handler(req, res) {
    const account = getAccountDatas(req, res)
    let { action, amount, address, password } = req.body
    if (!account || !action || !amount || !address) {
        res.status(203).json({
            error: "Fill in all fields."
        });
    } else {
        // function isNumeric(str) {
        //     if (typeof str != "string") return false // we only process strings!  
        //     return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        //         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
        // }
        // amount = parseInt(amount)
        // if (typeof amount === 'number') {
        //     if()
        //     res.status(203).json({
        //         error: "ok" + amount
        //     });

        // } else {
        //     res.status(203).json({
        //         error: "Invalid amount"
        //     });
        // }


        // if (isNumeric(amount)) {
        //     res.status(203).json({
        //         error: "ok" + amount
        //     });
        // } else {
        //     res.status(203).json({
        //         error: "Invalid amount"
        //     });
        // }
        // amount = amount.replace('+', '')
        amount = amount.replace('+', '')
        let token = account.user.token
        const datas = {
            token,
            account,
            action,
            amount,
            address,
            password,
            visitor: vi(req)
        }
        let result = await getApi('user/withdrawal', datas);
        if (result.error) {
            res.status(203).json(result);
        } else {
            res.status(200).json(result);
        }
    }
} 