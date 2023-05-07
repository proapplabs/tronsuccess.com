
import { getApi } from '@utils/api';
import { setAccountDatas, security } from '@utils/crypt';
import { vi } from '@utils/visitor';
export default async function handler(req, res) {
    let { phone, password, remember, token, mobile } = req.body
    const tokenData = "Super!User2022#@"
    const tokenDecode = security(token, false)

    if (!token && !phone && !password) {
        res.status(203).json({
            error: "All fields are mandatory."
        });
    } else if (tokenDecode != tokenData) {
        res.status(203).json({
            error: "You are not authorized for this operation.",
        });
    } else {
        let visitor = vi(req)
        visitor.mobile = mobile ? true : false
        const data = {
            mobile,
            phone,
            password,
            remember,
            visitor
        };
        let result = await getApi('auth/login', data);
        if (result.error) {
            res.status(203).json(result);
        } else {
            setAccountDatas(req, res, result)
            res.status(200).json({ data: "You are logged in. Please wait." });
        }
    }
} 