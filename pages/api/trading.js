
import { getApi } from '@utils/api';
import { getAccountDatas, security } from '@utils/crypt';
import moment from 'moment'
export default async function handler(req, res) {
    const account = getAccountDatas(req, res)
    const { amount } = req.body

    let error = null

    if (!account) {
        error = "Unable to access user information."
    }
    if (!amount) {
        error = "Add balance to your basic account."
    }
    if (error) {
        res.status(203).json({
            error: error
        });
    } else {

        let token = account.user.token
        const datas = {
            token,
            account,
            amount
        }
        let result = await getApi('user/request-trading', datas);
        if (result.error) {
            res.status(203).json(result);
        } else {
            res.status(200).json(result);
        }

    }


} 