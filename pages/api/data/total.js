
import { getApi } from '@utils/api';
import { getAccountDatas, security } from '@utils/crypt';
import moment from 'moment'
export default async function handler(req, res) {
    let token = null
    res.status(200).json({
        platformDataDisplay: {
            profit: Math.ceil(new Date().getTime() / 4),
            membership: Math.ceil(new Date().getTime() / 10000)
        }
    });
} 