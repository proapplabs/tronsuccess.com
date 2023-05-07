
import { getApi } from '@utils/api';
import { getAccountDatas } from '@utils/crypt';
export default async function handler(req, res) {
    const account = getAccountDatas(req, res)
    const { total_users, amount, password, message } = req.body
    if (!account || !amount || !password || !total_users || !message) {
        res.status(203).json({
            error: "Fill in all fields."
        });
    } else {
        let token = account.user.token
        const datas = {
            token,
            account,
            amount,
            total_users,
            message,
            password
        }
        let result = await getApi('user/bonus/request', datas);
        if (result.error) {
            res.status(203).json(result);
        } else {
            res.status(200).json(result);
        }
    }
} 