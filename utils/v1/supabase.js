// import { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { clearData } from '@utils/v1/api';
import { pass } from '@utils/v1/crypt';
import { addressCreate, getTrx } from '@utils/v1/tron';
import { systemTime, getPrice, getRemainingDate, zeroAdd } from '@utils/v1/func'
// import { getCookies, hasCookie, getCookie } from 'cookies-next';
// 3RoV61EdFYxI3RDX
const supabaseAdmin = createClient(
    process.env.SUPABASE_API_URL,
    process.env.SUPABASE_API_PUBLIC_KEY, { timeZone: 'Asia/Singapore' }
);
export function supabase() {
    const supabase = createClient(
        process.env.SUPABASE_API_URL,
        process.env.SUPABASE_API_PUBLIC_KEY, { timeZone: 'Asia/Singapore' }
    );
    return supabase
}
export function sb() {
    const supabase = createClient(
        process.env.SUPABASE_API_URL,
        process.env.SUPABASE_API_PUBLIC_KEY, { timeZone: 'Asia/Singapore' }
    );
    return supabase
}
export async function allDomainsBalances(min, max, filter) {
    const table = "balances"
    let column = filter.column
    let amount = filter.amount
    if (column == "trx_basic" || column == "trx_promotion") {
        amount = getTrx(filter.amount, true)
    }
    const result = await supabaseAdmin.from(table)
        .select(
            '*,user:user_id(wallet,promotion),domain:domain_id(domain)',
            { count: 'exact' }
        ) // , { count: 'exact' }
        // .order('user_id', { ascending: true })
        // .eq('domain_id', "77")
        .eq('date', "2023-04-19")
        .order(column, { ascending: false })
        .range(min, max)
        .gte(column, amount)
    return result;
    // return {}
}
export async function allDomainsRecharge(min, max, filter) {
    const table = "requests_withdrawal_recharge"
    // let column = filter.column
    // let amount = filter.amount
    // if (column == "trx_basic" || column == "trx_promotion") {
    //     amount = getTrx(filter.amount, true)
    // }
    // ,user:user_id(domain,token),domain:domain_id(token)
    const result = await supabaseAdmin.from(table)
        .select(
            '*,user:user_id(wallet,promotion,token),domain:domain_id(domain,token)',
            { count: 'exact' }
        )
        // .gt('domain_id', 90)
        // .gt('domain_id', 90)
        // .gt('balance_trx', 1000000)
        // .and('balance_usdt', 'gte', 0)
        // .and('balance_usdt', 'lte', 10000000000000000)
        .order('balance_trx', { ascending: false })
        .range(min, max);
    return result;
}
export async function allUserDayLimitsDB(min, max, filter) {
    const table = "users"
    let result = null
    if (filter.rule == "eq") {
        result = await supabaseAdmin.from(table)
            .select('*') // , { count: 'exact' }
            .order('id')
            .eq('domain_id', filter.domain_id)
            .range(min, max)
            .eq("all_withdrawal_total_day", Number(filter.day))
    } else {
        result = await supabaseAdmin.from(table)
            .select('*') // , { count: 'exact' }
            .order('id')
            .eq('domain_id', filter.domain_id)
            .range(min, max)
            .gte("all_withdrawal_total_day", Number(filter.day))
    }
    // promotion_withdrawal_total_day
    // basic_withdrawal_total_day
    // all_withdrawal_total_day
    // console.log(filter)
    // console.log(result)
    return result;
}
export async function allDB(table, limit = null) {
    if (limit) {
        const { data, error } = await supabaseAdmin.from(table).select('*').order('id').limit(limit);
        return data;
    } else {
        const { data, error } = await supabaseAdmin.from(table).select('*').order('id');
        return data;
    }
}
export async function getWithdrawalBasic(domain_id, action, min, max) {
    const table = "requests_withdrawal"
    const query_user = 'user:user_id(rosette,scam,permission_basic_withdrawal,permission_promotion_withdrawal,basic_withdrawal_total_day,promotion_withdrawal_total_day,all_withdrawal_total_day)'
    const query_domain = 'domain_id(id,domain,status)'
    const sqlSelect = '*,' + query_user + ',' + query_domain

    const { data, error } = await supabaseAdmin.from(table).select(sqlSelect).eq('domain_id', domain_id).eq('action', action).order('id', { ascending: false }).range(min, max);
    return data;
}
export async function getWithdrawalDeleteTotals(domain_id, action) {
    const table = "requests_withdrawal"
    const { data, error, count } = await supabaseAdmin.from(table).select('*', { count: 'exact' }).eq("error", true).eq("status", false).eq('domain_id', domain_id).eq('action', action).order('id', { ascending: false });
    return {
        data,
        count
    };
}

export async function getUserWithdrawalCalc(user_id) {
    let { data, error } = await supabaseAdmin.rpc('user_withdrawal_calc', { userid: user_id }).single();
    if (data) {
        let promotion_withdrawal_total_day = data.promotion_total ? data.promotion_total : 0
        let basic_withdrawal_total_day = data.basic_total ? data.basic_total : 0
        let all_withdrawal_total_day = promotion_withdrawal_total_day + basic_withdrawal_total_day

        let updateDatas = {
            basic_withdrawal_total: data.basic_amount ? data.basic_amount : 0,
            promotion_withdrawal_total: data.promotion_amount ? data.promotion_amount : 0,
            promotion_withdrawal_total_day,
            basic_withdrawal_total_day,
            all_withdrawal_total_day
        }
        let userUpdate = await updateIdDB('users', updateDatas, user_id);
        if (userUpdate) {
            return {
                basic_amount: data.basic_amount ? data.basic_amount : 0,
                promotion_amount: data.promotion_amount ? data.promotion_amount : 0,
                basic_total: promotion_withdrawal_total_day,
                promotion_total: basic_withdrawal_total_day,
                all_total: all_withdrawal_total_day
            }
        } else {
            return data
        }
    } else {
        return data
    }

}
export async function trxRechargeDeleteUser(user_id, action) {
    const table = "requests_withdrawal_recharge"
    const deleted = await supabaseAdmin.from(table).delete().eq('user_id', user_id).eq('action', action);
    return deleted;
}
export async function trxRechargeDeleteID(id) {
    const table = "requests_withdrawal_recharge"
    const deleted = await supabaseAdmin.from(table).delete().eq('id', id);
    return deleted;
}
export async function getWithdrawalDeleteAll(domain_id, action) {
    const table = "requests_withdrawal"
    // const deleted = await supabaseAdmin.from("requests_withdrawal").delete().eq('id', id);
    const deleted = await supabaseAdmin.from(table).delete().eq('domain_id', domain_id).eq("status", false).eq('action', action);
    return deleted;
}
export async function getInvestmentsDB(domain_id, action, min, max, filter = null) {
    const table = "investments"
    let result = null
    if (filter) {
        if (filter.action == "below") {
            result = await supabaseAdmin.from(table).select('*,transfer:transfer_id(*)', { count: 'exact' }).eq('domain_id', domain_id).eq('action', action)
                .lt('amount', filter.amount).order('amount', { ascending: false }).range(min, max);
        } else {
            result = await supabaseAdmin.from(table).select('*,transfer:transfer_id(*)', { count: 'exact' }).eq('domain_id', domain_id).eq('action', action)
                .gt('amount', filter.amount).order('amount', { ascending: false }).range(min, max);
        }
    } else {
        result = await supabaseAdmin.from(table).select('*,transfer:transfer_id(*)', { count: 'exact' }).eq('domain_id', domain_id).eq('action', action).order('id', { ascending: false }).range(min, max);
    }
    return result;
}
export async function getLevelsDB(domain_id, action, min, max, filter = null) {
    const table = "requests_levels"
    let result = null
    if (filter) {
        if (filter.action == "below") {
            result = await supabaseAdmin.from(table).select('*,domain:domain_id(levels,domain),level_1:level_1_id(promotion_total),level_2:level_1_id(promotion_total),level_3:level_1_id(promotion_total)', { count: 'exact' }).eq('domain_id', domain_id).eq('action', action)
                .lt('amount', filter.amount).order('amount', { ascending: false }).range(min, max);
        } else {
            result = await supabaseAdmin.from(table).select('*,domain:domain_id(levels,domain),level_1:level_1_id(promotion_total),level_2:level_1_id(promotion_total),level_3:level_1_id(promotion_total)', { count: 'exact' }).eq('domain_id', domain_id).eq('action', action)
                .gt('amount', filter.amount).order('amount', { ascending: false }).range(min, max);
        }
    } else {
        result = await supabaseAdmin.from(table).select('*,domain:domain_id(levels,domain),level_1:level_1_id(promotion_total),level_2:level_1_id(promotion_total),level_3:level_1_id(promotion_total)', { count: 'exact' }).eq('domain_id', domain_id).eq('action', action).order('id', { ascending: false }).range(min, max);
    }
    return result;
}
export async function getDomainsLevelsDB(min, max, filter = null) {
    const table = "requests_levels"
    const domain = "domain:domain_id(levels,domain,promotion_promotion_limit,basic_promotion_limit)"
    const level1 = "level_1:level_1_id(promotion_total)"
    const level2 = "level_2:level_2_id(promotion_total)"
    const level3 = "level_3:level_3_id(promotion_total)"
    let result = null
    filter.order = false
    if (filter) {
        if (filter.show == "all") {
            result = await supabaseAdmin.from(table)
                .select('*,' + domain + ',' + level1 + ',' + level2 + ',' + level3, { count: 'exact' })
                .order("id", { ascending: filter.order ? true : false })
                .range(min, max);
        } else {
            if (filter.control == true) {
                result = await supabaseAdmin.from(table)
                    .select('*,' + domain + ',' + level1 + ',' + level2 + ',' + level3, { count: 'exact' })
                    .eq("status", filter.status)
                    .eq("level_1_status", false)
                    .eq("level_2_status", false)
                    .eq("level_3_status", false)
                    .eq("control", filter.control)
                    .eq("hidden", filter.hidden)
                    .range(min, max)
                    .order("id", { ascending: filter.order ? true : false });
            } else {
                result = await supabaseAdmin.from(table)
                    .select('*,' + domain + ',' + level1 + ',' + level2 + ',' + level3, { count: 'exact' })
                    .eq("status", filter.status)
                    .eq("control", filter.control)
                    .eq("hidden", filter.hidden)
                    .range(min, max)
                    .order("id", { ascending: filter.order ? true : false });
            }
        }
    } else {
        result = await supabaseAdmin.from(table)
            .select('*,' + domain + ',' + level1 + ',' + level2 + ',' + level3, { count: 'exact' })
            .order("id", { ascending: filter.order ? true : false })
            .range(min, max);
    }
    return result;
}



export async function getUserInvestmentsDB(user_id, domain_id, min, max) {
    const table = "investments"
    const { data, error } = await supabaseAdmin.from(table).select('*,transfer:transfer_id(*)').eq('domain_id', domain_id).eq('user_id', user_id).order('id', { ascending: false }).range(min, max);
    return data;
}
export async function getDB(table, id) {
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('id', id).order('id');
    return data;
}
export async function getTableUserIdDB(table, user_id) {
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('user_id', user_id).order('id');
    return data;
}
export async function getLogsUserDB(user_id) {
    const { data, error } = await supabaseAdmin.from("logs_user").select('*').eq('user_id', user_id).order('id', { ascending: false });
    return data;
}
export async function getUserDB(User_id) {
    const { data, error } = await supabaseAdmin.from("users").select('*').eq('id', User_id).order('id').single();

    let userCalcUpdate = await getUserWithdrawalCalc(User_id);

    return data;
}
export async function getUserLoginLogsDB(User_id) {
    const { data, error } = await supabaseAdmin.from("logs_login").select('*').eq('user_id', User_id).order('id');
    return data;
}
export async function getUserWithdrawalDB(id) {
    const table = "requests_withdrawal"
    const query_user = "user:user_id(scam,rosette,permission_basic_withdrawal,permission_promotion_withdrawal,promotion_withdrawal_total_day,basic_withdrawal_total_day,all_withdrawal_total_day)"
    const { data, error } = await supabaseAdmin.from(table).select('*,' + query_user).eq('user_id', id).order('id', { ascending: false });
    return data;
}
export async function deletePromotionDB(id) {
    const deleted = await supabaseAdmin.from("users_promotions").delete().eq('id', id);
    return deleted;
}
export async function deleteBalanceDB(id) {
    const deleted = await supabaseAdmin.from("balances").delete().eq('id', id);
    return deleted;
}
export async function deletePlanDB(id) {
    const deleted = await supabaseAdmin.from("requests_plan").delete().eq('id', id);
    return deleted;
}
export async function deleteUserWithdrawalDB(id) {
    const deleted = await supabaseAdmin.from("requests_withdrawal").delete().eq('id', id);
    return deleted;
}
export async function getUserAccountsDB(id) {
    const { data, error } = await supabaseAdmin.from('user_accounts').select('*').eq('user_id', id).order('id');
    return data;
}
export async function getUserTransferDB(id) {
    const { data, error } = await supabaseAdmin.from('transfers').select('*').eq('user_id', id).order('id');
    return data;
}
// export async function getUserIdDB(id) {
//     const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', id).order('id');
//     return data;
// }
export async function getAdminDB(username, password) {
    const table = "admin"
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('username', username).eq('password', password).order('id').single();
    return data;
}
export async function getDomainTokenDB(token) {
    const table = "domains"
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('token', token).order('id').single();
    return data;
}
export async function requestCountDB(table, user_id) {
    const { data, error, count } = await supabaseAdmin.from(table).select('date', { count: 'exact' }).eq('user_id', user_id).eq('date', systemTime().date_system);
    return count;
}
export async function requestWithdrawalCountDB(user_id) {
    const table = "requests_withdrawal"
    const { data, error, count } = await supabaseAdmin.from(table).select('date', { count: 'exact' }).eq("status", false).eq('user_id', user_id);
    return count;
}
export async function getTradingUserAllDB(user_id) {
    const table = "requests_trading"
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('user_id', user_id).order('id', { ascending: false });
    return data;
}
export async function getDomainUsersStats(domain_id) {
    const { data } = await supabaseAdmin.rpc('domain_stats', { domainid: domain_id })
    return data
}
export async function getDomainUsersWitdrawalsStats(domain_id) {
    const { data } = await supabaseAdmin.rpc('domain_users_withdrawals_stats', { domain_id: domain_id })
    return data
}
export async function getUserTokenDB(token) {
    const table = "users"
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('token', token).single();

    // let userCalcUpdate = await getUserWithdrawalCalc(User_id);
    return data;
}

export async function getUserPhoneDB(domain_id, phone) {
    const table = "users"
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('phone', phone).eq('id', domain_id).order('id');
    return data;
}
export async function getUserPhoneTotalDB(domain_id, phone) {
    const table = "users"
    const { data, error, count } = await supabaseAdmin.from(table).select('phone', { count: 'exact' }).eq('phone', phone).eq('domain_id', domain_id);
    return count;
}

export async function getUserReferansCode(reference_code, domain_id) {
    const { data, error } = await supabaseAdmin.from("users").select('id,reference_code,invite_code').eq('invite_code', reference_code).eq('domain_id', domain_id).order('id').single();
    return data;
}

export async function getUserLevels(id) {
    let { data } = await supabaseAdmin.from("users").select('id,reference_code,domain_id').eq('id', id).single();
    if (data) {
        let result = {}
        let domain_id = data.domain_id
        let level_1 = await getUserReferansCode(data.reference_code, domain_id)
        if (level_1) {
            data.level_1 = level_1.id
            result = { ...result, level_1: level_1.id }
            let level_2 = await getUserReferansCode(level_1.reference_code, domain_id)
            if (level_2) {
                data.level_2 = level_2.id
                result = { ...result, level_2: level_2.id }
                let level_3 = await getUserReferansCode(level_2.reference_code, domain_id)
                if (level_3) {
                    data.level_3 = level_3.id
                    result = { ...result, level_3: level_3.id }
                }
            }
        }
        const update = await updateIdDB("users", result, data.id)
        const updated = await supabaseAdmin.from("users").select('*').eq('id', id).single();
        return data
    }
}
export async function getUserAllLevelsParentsDB(reference_code, domain_id) {
    let result = []
    let level = await getUserReferansCode(reference_code, domain_id)
    if (level) {
        result = [...result, level]
        let parents = await getUserAllLevelsParentsDB(level.reference_code, domain_id)
        if (parents) {
            parents.map((l, i) => {
                result = [...result, l]
            })
        }
    }
    return result
}
export async function getUserAllLevelsDB(id) {
    let { data } = await supabaseAdmin.from("users").select('*').eq('id', id).single();
    if (data) {
        let result = []
        let levels = null
        if (data.reference_code) {
            let domain_id = data.domain_id
            levels = await getUserAllLevelsParentsDB(data.reference_code, domain_id)
            levels.map((l, i) => {
                result = [...result, l]
            })
        }
        return result
    }
}
export async function getUserTotalDB(domain_id) {
    const table = "users"
    const { data, error, count } = await supabaseAdmin.from(table).select('id', { count: 'exact' }).eq('domain_id', domain_id);
    return count;
}
export async function getUserInviteCodeDB(domain_id, invite_code) {
    const table = "users"
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('invite_code', invite_code).eq('domain_id', domain_id).order('id').single();
    return data;
}
export async function getDataIdDB(table, id = null) {
    const { data, error } = await supabaseAdmin.from(table).select(`*`).eq('id', id).order('id');
    await queryAddData(table, data)
    return data;
}
export async function getDatasDB(table) {
    const { data, error } = await supabaseAdmin.from(table).select(`*`).order('id');
    await queryAddData(table, data)
    return data;
}
export async function getDomainDatasDB(domain_id, table) {
    const { data, error } = await supabaseAdmin.from(table).select(`*`).eq('domain_id', domain_id).order('id');
    await queryAddData(table, data)
    return data;
}
export async function getDomainsDB(status = true) {
    const table = "domains"
    let { data, error } = await supabaseAdmin.from(table).select(`*`).eq("status", status).order('id');

    let result = await Promise.all(data.map(async (d, i) => {
        d.total_user = await getDomainCountUserDB(d.id)
        return d
    }))
    return result;
}
export async function getDomainCountUserDB(domain_id) {
    const { data, error, count } = await supabaseAdmin.from("users").select(`id`, { count: 'exact' }).eq('domain_id', domain_id);
    return count
}
export async function getPlanUsersDB(id) {
    const { data, error } = await supabaseAdmin.from("requests_plan").select(`*,users:user_id(*)`).eq('plan_id', id);

    return data
}
export async function getLangsDatasDB() {
    const table = 'langs'
    const { data, error } = await supabaseAdmin.from(table).select(`*`);
    await queryAddData(table, data)
    return data;
}
export async function getSlugDB(table, slug) {
    const slugQuery = await supabaseAdmin.from('datas').select(`*`).eq('value', slug).eq('name', 'slug').eq('table', table).single();
    if (slugQuery.data) {
        const slugData = slugQuery.data
        const id = slugData.table_id
        const data = getDataIdDB(table, id)
        return data
    } else {
        return false
    }
}

export async function updateTableDatasDB(datas) {
    const table_id = datas.id
    const table = datas.table

    const update = await updateIdDB(table, datas.data, table_id)

    let langs = await Promise.all(datas.langs.map(async (v, i) => {
        v.value = v.value.replace("<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n", "")
        v.value = v.value.replace("\n</body>\n</html>", "")
        if (v.value.length) {
            let { data, error } = await supabaseAdmin.from('datas').select('*')
                .eq('name', v.name)
                .eq('lang_id', v.lang_id)
                .eq('table', table)
                .eq('table_id', table_id)
                .single();
            if (data) {
                const data_id = data.id;
                if (data_id) {
                    const { data, error } = await supabaseAdmin
                        .from('datas')
                        .update(v)
                        .eq('id', data_id)
                }
            } else {
                const { data, error } = await supabaseAdmin
                    .from('datas')
                    .insert(v)
            }
        }
        return v

    }));
    return langs
}

export async function updateDatasDB(table, datas) {
    const table_id = datas.id;
    const langs = datas.langs;
    const errors = [];
    const success = [];
    const langDatas = Object.values(datas.langs).map(async (l, i) => {
        const lang_id = l.lang_id;
        const lang = l.lang;
        if (l.data) {
            const langData = l.data;
            for (let property in langData) {
                const name = property;
                const value = langData[property];
                const saveData = {
                    table,
                    table_id,
                    name,
                    value,
                    lang,
                    lang_id
                }
                let { data, error } = await supabaseAdmin.from('datas').select('*')
                    .eq('name', name)
                    .eq('lang_id', lang_id)
                    .eq('table', table)
                    .eq('table_id', table_id)
                    .single();
                if (data) {
                    const data_id = data.id;
                    if (data_id) {
                        const { data, error } = await supabaseAdmin
                            .from('datas')
                            .update(saveData)
                            .eq('id', data_id)
                    }
                } else {
                    const { data, error } = await supabaseAdmin
                        .from('datas')
                        .insert(saveData)
                }
            }
            success.push(lang);
        } else {
            errors.push(lang);
        }
    })
    return {
        lang_status: {
            total: success.length + errors.length,
            success: {
                message: 'The contents of  ' + success.toString().toUpperCase() + '  languages are registered successfully. Please fill in the contents of these languages.',
                langs: success,
                count: success.length,
            },
            errors: {
                message: 'The contents of ' + errors.toString().toUpperCase() + '  languages could not be registered. Please fill in the contents of these languages.',
                langs: errors,
                count: errors.length,
            }
        }
    };
}
export async function userWalletControl(id, data, column) {
    const walletAddressCreate = await addressCreate()
    if (walletAddressCreate) {
        const userWallet = walletAddressCreate.data
        const newWallet = pass(JSON.stringify(userWallet), true)
        if (column == 'promotion') {
            const userUpdate = await updateIdDB('users', {
                promotion: newWallet
            }, id)
            if (userUpdate) {
                data.promotion = walletAddressCreate.newWallet
            }
        }
        if (column == 'wallet') {
            const userUpdate = await updateIdDB('users', {
                wallet: newWallet
            }, id)
            if (userUpdate) {
                data.wallet = walletAddressCreate.newWallet
            }
        }

    }
    return data
}
export async function userLevelUsersCountDB(user_id) {
    const level_1 = await supabaseAdmin.from("users").select('level_1', { count: 'exact' }).eq('level_1', user_id);
    const level_2 = await supabaseAdmin.from("users").select('level_2', { count: 'exact' }).eq('level_2', user_id);
    const level_3 = await supabaseAdmin.from("users").select('level_3', { count: 'exact' }).eq('level_3', user_id);
    const updateDatas = {
        level_1_total_user: level_1.count,
        level_2_total_user: level_2.count,
        level_3_total_user: level_3.count,
    }
    const userUpdated = await updateIdDB('users', updateDatas, user_id)
    console.log(updateDatas)
    return updateDatas
}
export async function getFrontUserLoginDB(domain_id, phone, password, log) {
    if (domain_id && phone && password) {
        phone = clearData(phone, 'text')
        password = pass(password, "pass");
        const { data, error } = await supabaseAdmin.from("users").select('*').eq('domain_id', domain_id).eq('phone', phone).eq('password', password).order('id').single();
        if (data) {
            const user_id = data.id
            // const lastLogin = await supabaseAdmin.from("logs_login").select('*').eq('user_id', user_id).order('id', { ascending: false }).limit(1).single()

            if (log) {
                let addressBasic = await JSON.parse(pass(data.wallet, false))
                let addressPromotion = await JSON.parse(pass(data.promotion, false))
                const levelUsersCount = await userLevelUsersCountDB(user_id)
                const logAdd = await visitorDB({
                    action: "login",
                    log,
                    user_id,
                    domain_id
                });
                return {
                    status: data.status,
                    domain: data.domain,
                    phone: data.phone,
                    address_basic: addressBasic.address,
                    address_promotion: addressPromotion.address,
                    token: data.token,
                    invite_code: data.invite_code,
                    token: data.token,
                    level_1: data.level_1,
                    level_2: data.level_2,
                    level_3: data.level_3,
                    basic_total: getPrice(data.basic_total),
                    promotion_total: getPrice(data.promotion_total),
                    last_login: null,
                    balance: {
                        basic: {
                            total: getPrice(data.basic_total),
                            trx: getPrice(data.basic_total_trx),
                        },
                        promotion: {
                            total: getPrice(data.promotion_total),
                            trx: getPrice(data.promotion_total_trx),
                        }
                    }
                };
            } else {
                return {
                    error: "No Records Found. "
                }
            }
        } else {
            return {
                error: "No Records Found. "
            }
        }
    } else {
        return {
            error: "No Records Found."
        }
    }
}
export async function getUserPromotionsDB(user_id) {
    const table = "users_promotions"
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('user_id', user_id).order('id', { ascending: false });
    return data;
}
export async function getAllTeamsDB(user_id, domain_id) {
    const table = "users_promotions"
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('user_id', user_id).order('id', { ascending: false });
    return data;
}
export async function getAllProfitDB(user_id, domain_id) {
    const table = "requests_withdrawal"
    const { data, error } = await supabaseAdmin.from(table).select('*,domain_id(domain)').eq('user_id', user_id).order('id');
    return data;
}
export async function getProfitIdDB(id) {
    const table = "requests_withdrawal"
    const { data, error } = await supabaseAdmin.from(table).select('*,domain_id(domain)').eq('id', id).order('id').single();
    return data;
}
export async function transferInsertDB(datas) {
    const table = 'transfers'
    const { data, error } = await supabaseAdmin.from(table).insert(datas)
    if (data) {
        // id controlü ekle
        if (data[0].id) {
            return data[0].id
        }
        return data
    } else {
        return error
    }
}
export async function addUserPromotionDB(user, domain, amount) {
    let level_1_rate = null
    let level_2_rate = null
    let level_3_rate = null

    if (domain.levels[0].sort == 1) {
        level_1_rate = Number(domain.levels[0].percent)
    }
    if (domain.levels[1].sort == 2) {
        level_2_rate = Number(domain.levels[1].percent)
    }
    if (domain.levels[2].sort == 3) {
        level_3_rate = Number(domain.levels[2].percent)
    }
    if (user.level_1) {
        const add = await insertDB('users_promotions', {
            user_id: user.level_1,
            amount: amount / 100 * level_1_rate,
            promotion_user_id: user.id,
            level: 1,
            domain_id: domain.id,
            amount_total: amount
        });
    }
    if (user.level_2) {
        const add = await insertDB('users_promotions', {
            user_id: user.level_2,
            amount: amount / 100 * level_2_rate,
            promotion_user_id: user.id,
            level: 2,
            domain_id: domain.id,
            amount_total: amount
        });
    }
    if (user.level_3) {
        const add = await insertDB('users_promotions', {
            user_id: user.level_3,
            amount: amount / 100 * level_3_rate,
            promotion_user_id: user.id,
            level: 3,
            domain_id: domain.id,
            amount_total: amount
        });
    }
}
export async function insertDB(table, datas) {
    const { data, error } = await supabaseAdmin.from(table).insert(datas)
    if (data) {
        // id controlü ekle
        if (data[0].id) {
            return data[0].id
        }
        return data
    } else {
        return error
    }
}
export async function updateIdDB(table, datas, id) {
    const { data, error } = await supabaseAdmin.from(table).update(datas).eq('id', id)
    if (data) {
        return true
    } else {
        return error
    }
}
export async function insertDomainDB(datas) {
    const tableDomain = 'domains'
    const domain_id = await insertDB(tableDomain, datas)
    if (domain_id) {
        // const pageDatas = {
        //     data: {
        //         domain_id,
        //         slug: 'about'
        //     },
        //     datas: [
        //         {
        //             name: "title",
        //             value: "About",
        //             lang: "en",
        //             lang_id: 1
        //         },
        //         {
        //             name: "content",
        //             value: null,
        //             lang: "en",
        //             lang_id: 1
        //         }
        //     ]
        // }
        // const pageInsert = await insertDatasDB('pages', pageDatas)
        return domain_id
    } else {
        return false
    }
}

export async function addUserNotificationDB(user, table, table_id, title, content) {
    const saveNotifications = await insertDatasDB('notifications', {
        data: {
            user_id: user.id,
            domain_id: user.domain_id,
            table_name: table,
            table_id: table_id
        },
        datas: [
            { name: 'title', value: title, lang_id: 1, lang: "en" },
            { name: 'content', value: content, lang_id: 1, lang: "en" }
        ]
    })
}
export async function getDomainTableDB(table, domain_id) {
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('domain_id', domain_id).order('id');
    await queryAddData(table, data)

    return data;
}

export async function getDomainTotalUserDB(domain_id) {
    const table = "users"
    const { data, error } = await supabaseAdmin.from(table).select('*', { count: "exact" }).eq('domain_id', domain_id).order('id');
    return data;
}
export async function getDomainTableTotalDB(domain_id, table) {
    const { data, error, count } = await supabaseAdmin.from(table).select('*', { count: "exact" }).eq('domain_id', domain_id).order('id');

    return count;
}
export async function getDomainUsersDB(domain_id, min, max) {

    const table = 'users'
    const { data, error } = await supabaseAdmin.from(table).select('*').eq('domain_id', domain_id).order('id', { ascending: false }).range(min, max);
    return data;
}
export async function getUserBonusCountDB(user_id, status = false) {
    let result = await supabaseAdmin.from("requests_bonus").select('*', { count: "exact" }).eq('status', status).eq('user_id', user_id).order('id');
    return result.count;
}
export async function getDomainPagesDB(domain_id) {
    const table = 'pages'
    let { data, error } = await supabaseAdmin.from(table).select('*').eq('domain_id', domain_id).order('id');
    await queryAddData(table, data)
    return data;
}
export async function getUserPlansDB(domain_id, user_id) {
    let { data, error } = await supabaseAdmin.from("requests_plan").select('*,plan:plan_id(rate)').eq('domain_id', domain_id).eq('user_id', user_id).order('id');
    let result = await Promise.all(data.map(async (p, i) => {
        let plan = await supabaseAdmin.from('datas').select('*').eq('name', 'title').eq("table", "plans").eq('table_id', p.plan_id).eq('lang', 'en').single();

        p.plan.title = plan.data.value ? plan.data.value : "Null"
        p.remaining = getRemainingDate(p.start_date, p.stop_date)
        p.order_number = '#' + zeroAdd(p.id)
        return p
    }));
    return result;
}
export async function getDomainPlansDB(domain_id, status = false) {
    const table = 'plans'

    let { data, error } = await supabaseAdmin.from(table).select('*').eq('domain_id', domain_id).eq('status', status).order('id');

    if (data.length) {
        await queryAddData(table, data)
    }
    return data;
}
export async function getDomainPlanIdDB(domain_id, id, status) {
    const table = 'plans'
    let query = false
    let data = false
    // if (!status) {
    //     query = await supabaseAdmin.from(table).select('*').eq('domain_id', domain_id).eq('id', id).single();
    //     data = query.data
    // } else {
    //     query = await supabaseAdmin.from(table).select('*').eq('domain_id', domain_id).eq('id', id).eq('status', status).single();
    //     data = query.data
    // }
    query = await supabaseAdmin.from(table).select('*').eq('domain_id', domain_id).eq('id', id).single();
    data = query.data
    if (data.length) {
        await queryAddData(table, data)
    }
    return data;
}
async function queryAddDatas(table, datas) {
    if (datas.length) {
        await Promise.all(datas.map(async (d) => {
            const { data, error } = await supabaseAdmin.from('datas').select(`*`).eq('table', table).eq('table_id', d.id).order('id');
            // let langDatas = {}; 
            data.map((item) => {
                let lang = item.lang
                let name = item.name
                let value = item.value
                let beforeData = langDatas[lang]
                if (beforeData) {
                    langDatas[lang] = [beforeData, item]
                } else {
                    langDatas[lang] = item
                }
            })
            return d;
        }))
    }
}
async function queryAddData(table, datas) {
    if (datas.length) {
        await Promise.all(datas.map(async (d) => {
            const { data, error } = await supabaseAdmin.from('datas').select(`*`).eq('table', table).eq('table_id', d.id);
            let langs = {}
            data.map((item) => {
                let lang = [item.lang]
                let name = item.name
                let value = item.value
                let before = langs[name]
                langs[name] = lang.reduce((accumulator, key) => {
                    return { ...before, [key]: value };
                }, {});
            })
            Object.assign(d, langs);
            return d;
        }))
    } else {

    }
}
export async function insertDatasDB(table, datas) {
    const insert = await insertDB(table, datas.data)
    if (insert) {
        const datasRows = datas.datas.map((d) => {
            d.table_id = insert
            d.table = table
            return d
        })
        const { data, error } = await supabaseAdmin
            .from('datas')
            .upsert(datas.datas)
        return insert
    } else {
        return false
    }

}
export async function getDomainFixedNotificationsDB(domain_id, fixed = true) {
    const { data, error } = await supabaseAdmin.from('notifications').select(`*`).eq('domain_id', domain_id).eq('fixed', true).order('id', { ascending: false })
    if (data) {
        if (data.length) {
            await queryAddData('notifications', data)
        }
        return data
    } else {
        return error
    }
}
export async function getDomainNotificationsDB(domain_id, fixed = true) {
    const { data, error } = await supabaseAdmin.from('notifications').select(`*`).eq('domain_id', domain_id).order('id', { ascending: false })
    if (data) {
        if (data.length) {
            await queryAddData('notifications', data)
        }
        return data
    } else {
        return error
    }
}
export async function getFixedNotificationAllDB(domain_id) {
    let { data, error } = await supabaseAdmin.from('notification').select(`*`).eq("domain_id", domain_id).order('sort', { ascending: true }) // , { ascending: true }
    if (data) {
        await queryAddData('notification', data)
        data.map((v, i) => {

            return v
        })
        return data
    } else {
        return error
    }
}
export async function getFixedNotificationDB(domain_id, status) {
    let { data, error } = await supabaseAdmin.from('notification').select(`*`).eq("domain_id", domain_id).order('sort', { ascending: true }) // , { ascending: true }
    if (data) {
        await queryAddData('notification', data)
        // let datas = []
        data.map((v, i) => {
            v.title = v.title.en
            v.content = v.content.en ? v.content.en : " "
            return v
            /*
            datas = [...datas, {
                id: v.id,
                created_at: v.created_at,
                read: v.status,
                title: v.title.en,
                content: v.content.en
            }]
            **/
        })
        return data
    } else {
        return error
    }
}
export async function getNotificationsDB(user_id, status, view = false) {
    const { data, error } = await supabaseAdmin.from('notifications').select(`*`).eq('user_id', user_id).eq('status', status).order('id', { ascending: false })
    if (data) {
        if (data.length) {
            await queryAddData('notifications', data)
        }
        if (view) {
            return data
        } else {
            let datas = []
            data.map((v, i) => {
                datas = [...datas, {
                    id: v.id,
                    created_at: v.created_at,
                    read: v.status,
                    title: v.title.en,
                    content: v.content.en
                }]
            })
            return datas
        }

    } else {
        return error
    }
}


export async function usersWithdrawalTotalDB(user_id) {
    const { data } = await supabaseAdmin.rpc('users_withdrawal_total', { userid: user_id })
    return data
}
export async function getAddressAccountCount(date) {
    // const { data } = await supabaseAdmin.rpc('usersWithdrawalTotalDB')
    const { data } = await supabaseAdmin.rpc('get_address_account_count', { getdate: "2022-11-27" })
    // const { data } = await supabaseAdmin.from('requests_withdrawal').select("address", { count: 'exact' }).eq("date", date).order('id', { ascending: false })

    // const { data, error } = await supabaseAdmin
    //     .from('requests_withdrawal')
    //     .select('address,user_id')
    //     .eq("date", '2022-11-27')
    // // .match({ user_id: 'Beijing' })

    return data
}



export async function test() {
    /*
const withdrawal = supabaseAdmin.from('withdrawal')

    .on('*', payload => {
        // console.log('Change received!', payload)
    })
    .subscribe()

    const channel = supabase.channel('withdrawal', {
        configs: {
          broadcast: { ack: true },
        },
      })
      
      // subscribe registers your client with the server
      channel.subscribe(async (status) => {
 
 
        if (status === 'SUBSCRIBED') {
          // now you can start broadcasting messages
          // sending a new message every second
          setInterval(async () => {
            const status = await channel.send({
              type: 'broadcast',
              event: 'location',
              payload: { x: Math.random(), y: Math.random() },
            })
            // console.log(status)
          }, 1000)
    
        }
      })
*/

    return "test";

    // const { data, error } = await supabaseAdmin.from('site').select(`*,notifications:id(* )`);
    /*
    const { data, error } = await supabaseAdmin.from('users').select(`*,site:domain(* )`);
    if (data) {
        return data;
    } else {
        return error;
    }
    */
    // console.log(data) 
}


export async function visitorDB(datas) {
    const table = "logs_user"
    const add = await insertDB(table, datas)
    return add
}

export async function rechargeControlDB(user_id, domain_id, counter, history) {
    const table = "requests_withdrawal_recharge"
    const add = await insertDB(table, {
        user_id,
        domain_id,
        counter,
        history
    });
    return add
}
export async function rechargeAddDB(user_id, domain_id, action) {
    const table = "requests_withdrawal_recharge"
    let { data, error, count } = await supabaseAdmin.from(table).select('*', { count: 'exact' }).eq('user_id', user_id).eq('domain_id', domain_id).eq('action', action).order('id');
    if (count) {
        return null
    } else {
        if (user_id && domain_id && action) {
            const add = await insertDB(table, {
                user_id,
                domain_id,
                action
            });
            return add
        } else {
            null
        }

    }
}

