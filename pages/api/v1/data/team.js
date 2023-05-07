
import jwt from 'jsonwebtoken';
const key = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEG";
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'
import { supabase, getUserTokenDB, getDomainTokenDB, getAllTeamsDB } from '@utils/v1/supabase'
export default async function handler(req, res) {
    apiKeyControl(req, res)
    emptyBody(req, res)
    const { account } = req.body
    if (account) {
        // System Token 
        const CORE_KEY = process.env.PRIVATE_AUTH_KEY
        // Domain Token 
        const DOMAIN_TOKEN = getApiKey(req, res)
        const DOMAIN_TOKEN_DECODE = jwt.verify(DOMAIN_TOKEN, CORE_KEY);
        // User Token
        const USER_TOKEN = account.user.token
        const USER_TOKEN_DECODE = jwt.verify(USER_TOKEN, CORE_KEY);
        if (DOMAIN_TOKEN_DECODE.name == USER_TOKEN_DECODE.sub) {
            const sb = supabase()
            let domain = await getDomainTokenDB(DOMAIN_TOKEN)
            let user = await getUserTokenDB(USER_TOKEN)
            if (user && domain) {
                const user_id = user.id
                const domain_id = domain.id
                const items = await getAllTeamsDB(user_id, domain_id)
                let result = {
                    // domain,
                    // user,
                    new: null,
                    items,
                    levels: [],
                    total: {
                        title: "Total",
                        total_amount: 0,
                        total_user: 0,
                    }
                }

                let calc = await sb.rpc('get_user_levels_stats', { uid: user_id }).single();
                calc = calc.data

                domain.levels.map((v, i) => {
                    let level = v.sort
                    let levelData = {
                        title: "Level " + level,
                    }
                    if (level == 1) {
                        levelData.total_user = calc.count_level_1_users
                        levelData.total_amount = calc.total_level_1_amount
                    }
                    if (level == 2) {
                        levelData.total_user = calc.count_level_2_users
                        levelData.total_amount = calc.total_level_2_amount
                    }
                    if (level == 3) {
                        levelData.total_user = calc.count_level_3_users
                        levelData.total_amount = calc.total_level_3_amount
                    }
                    result.total.total_amount += calc.total_amount
                    result.total.total_user += calc.total_users
                    result.levels = [...result.levels, levelData];
                })

                res.status(200).json(result)
            } else {
                res.status(203).json({ error: "You are not authorized for this operation. CODE:2003" })
            }

        } else {

            res.status(203).json({ error: "You are not authorized for this operation.CODE:2002" })
        }
    } else {
        res.status(203).json({ error: "An unexpected error has occurred.CODE:2001", exit: true })
    }
}