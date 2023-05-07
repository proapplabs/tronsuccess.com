
import { getApi } from '@utils/api';
import { getAccountDatas, security } from '@utils/crypt';
import moment from 'moment'
export default async function handler(req, res) {
    const account = getAccountDatas(req, res)
    const { id, price, password } = req.body
    if (!account || !id || !price) {
        res.status(203).json({
            error: "Unable to access user information."
        });
    } else {
        let token = account.user.token
        const datas = {
            token,
            account,
            id,
            password,
            amount: price
        }
        let result = await getApi('user/plan-register', datas);
        if (result.error) {
            res.status(203).json(result);
        } else {
            res.status(200).json(result);
        }
    }
} 