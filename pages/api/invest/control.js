
import { getApi } from '@utils/api';
import { getAccountDatas, security } from '@utils/crypt';
import moment from 'moment'
export default async function handler(req, res) {
    const account = getAccountDatas(req, res)
    const { action, address } = req.body
    if (!account || !address || !action) {
        res.status(203).json({
            error: "Unable to access user information."
        });
    } else {
        let token = account.user.token
        const datas = {
            token,
            account,
            action,
            address
        }
        let result = await getApi('user/invest', datas);
        if (result.error) {
            res.status(203).json(result);
        } else {
            res.status(200).json(result);
        }
    }
} 