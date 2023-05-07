import { getApi } from '@utils/api';
import { setAccountDatas, security } from '@utils/crypt'
import { vi } from '@utils/visitor';
export default async function handler(req, res) {
    const { token, phone, password, password_secret, invite_code } = req.body
    const tokeData = "Super!User2022#@"
    const tokenDecode = security(token, false)
    if (!token && !phone && !password && !password_secret && !invite_code) {
        res.status(203).json({
            error: "All fields are mandatory."
        });
    } else if (tokenDecode != tokeData) {
        res.status(203).json({
            error: "You are not authorized for this operation."
        });
    } else if (phone.toString().length < 6) {
        res.status(203).json({
            error: "It must be at least 6 characters long."
        });
    } else {
        const data = {
            phone,
            password,
            password_secret,
            invite_code,
            visitor: vi(req)
        };
        let result = await getApi('auth/register', data);
        if (result.error) {
            res.status(203).json(result);
        } else {
            setAccountDatas(req, res, result)
            res.status(200).json(result);
        }
    }
}    