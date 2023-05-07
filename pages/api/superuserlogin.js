
import { getApi } from '@utils/api';
import { setAccountDatas, security } from '@utils/crypt';
import moment from 'moment'
export default async function handler(req, res) {


    const { user_token, domain_token } = req.query

    if (!user_token || !domain_token) {
        res.writeHead(307, { Location: '/login' }).end()
    } else {
        const data = { user_token, domain_token };
        let result = await getApi('auth/login-admin', data);
        if (result.error) {
            res.status(203).json(result);
        } else {
            setAccountDatas(req, res, result)
            res.writeHead(307, { Location: '/' }).end()
        }

    }
}
