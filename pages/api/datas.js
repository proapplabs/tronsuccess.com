
import { getApi } from '@utils/api';
import { getAccountDatas, security, userExit, changeLanguage } from '@utils/crypt';

export default async function handler(req, res) {
    // let result = await getApi('data/visitor', {});

    const { lang } = req.query
    if (lang) {
        changeLanguage(lang, req, res)
    }
    const account = getAccountDatas(req, res)
    if (account) {
        const datas = { account }
        let result = await getApi('data/user', datas);

        if (result.error) {
            res.status(203).json(result);
        } else {
            res.status(200).json(result);
        }
    } else {
        let result = await getApi('data/visitor', {});
        res.status(203).json(result);
    }
} 