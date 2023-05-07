
import { getApi } from '@utils/api';
import { getAccountDatas } from '@utils/crypt';
export default async function handler(req, res) {
    const account = getAccountDatas(req, res)
    const { amount, password } = req.body
    if (!account || !amount || !password) {
        res.status(203).json({
            error: "Fill in all fields."
        });
    } else {
        let token = account.user.token
        const datas = {
            token,
            account,
            amount,
            password
        }
        let result = await getApi('user/transfer/promotion', datas);
        if (result.error) {
            res.status(203).json(result);
        } else {
            res.status(200).json(result);
        }
    }
} 