
import { getApi } from '@utils/api';
import { getAccountDatas } from '@utils/crypt';
export default async function handler(req, res) {
    const account = getAccountDatas(req, res)
    if (account) {
        const datas = { account }
        let result = await getApi('data/team', datas);
        if (result.error) {
            res.status(203).json(result);
        } else {
            res.status(200).json(result);
        }
    } else {
        res.status(400).json({
            error: "Unable to access user information."
        });
    }
} 