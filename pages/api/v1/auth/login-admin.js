
import { getDomainTokenDB, getUserTokenDB } from '@utils/v1/supabase';
export default async function handler(req, res) {
    let { user_token, domain_token } = req.body
    if (!user_token || !domain_token) {
        res.status(402).json({
            error: "Fill in the blank fields."
        });
    } else {
        const domain = await getDomainTokenDB(domain_token.trim())
        if (domain) {
            let user = await getUserTokenDB(user_token.trim())
            if (user.error) {
                res.status(203).json({
                    error: "Your information is incorrect. Please check your information."
                });
            } else {
                let resultDatas = {
                    levels: domain.levels,
                    languages: domain.languages
                }
                resultDatas.user = user;
                if (resultDatas.user) {
                    res.status(200).json(resultDatas);
                } else {
                    res.status(203).json({
                        error: "Your information is incorrect. Please check your information."
                    });
                }
            }
        } else {
            res.status(203).json({
                domain_token,
                error: "Failed to login. Try again later."
            });
        }
    }
}  