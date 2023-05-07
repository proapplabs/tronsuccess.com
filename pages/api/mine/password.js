
import { getApi } from '@utils/api';
import { getAccountDatas } from '@utils/crypt';
export default async function handler(req, res) {
    const account = getAccountDatas(req, res)
    const { action, oldPass, newPass, newPassConfirm } = req.body

    if (!account || !action || !oldPass || !newPass || !newPassConfirm) {
        res.status(203).json({
            error: "Fill in all fields."
        });
    } else {

        if (newPass.length <= 5) {
            res.status(203).json({
                error: "Your new password must be a minimum of 6 characters."
            });
        } else {
            if (newPass != newPassConfirm) {
                res.status(203).json({
                    c: newPass.length,
                    error: "Your new security password and your confirmation password do not match."
                });
            } else {

                let token = account.user.token
                const datas = {
                    token,
                    action,
                    account,
                    oldPass,
                    newPass,
                    newPassConfirm
                }
                let result = await getApi('user/password/change', datas);
                if (result.error) {
                    res.status(203).json(result);
                } else {
                    res.status(200).json(result);
                }
            }
        }
    }
}
