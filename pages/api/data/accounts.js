
import { getApi } from '@utils/api';
import { getAccountDatas, security } from '@utils/crypt';
import moment from 'moment'
export default async function handler(req, res) {
    let token = null
    if (getAccountDatas(req, res)) {
        const account = getAccountDatas(req, res)
        token = account.user.token

    }
    res.status(200).json({
        accounts: {
            wallet: {
                trx: 2000,
                dollar: 1000
            },
            promotion: {
                trx: 2000,
                dollar: 1000
            }
        }
    });
} 