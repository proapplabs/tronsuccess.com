
import jwt from 'jsonwebtoken';
import { apiKeyControl, emptyBody } from '@utils/v1/api'
import { insertDB } from '@utils/v1/supabase'

import { createClient } from '@supabase/supabase-js';
// 3RoV61EdFYxI3RDX
const supabase = createClient(
    process.env.SUPABASE_API_URL,
    process.env.SUPABASE_API_PUBLIC_KEY
);


export default async function handler(req, res) {

    // let data = {}
    // let error = {}


    // var today = new Date();
    // const utcDate1 = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()));
    // const f = utcDate1.toUTCString()

    // let d = new Date().toLocaleString('en-SG', {
    //     timeZone: 'Asia/Singapore',
    //     hour12: false
    // })

    // data = {
    //     d

    // }



    // const add = await insertDB("user_accounts", {
    //     user_id: 9,
    //     account: 'basic',
    //     action: "deposited",
    //     amount: 20000
    // })
    // const add = await insertDB("user_accounts", {
    //     user_id: 9,
    //     account: 'promotion',
    //     action: "deposited",
    //     amount: 1500
    // })

    // const table = "user_accounts"
    // const { data, error } = await supabase.from(table).select('*'    , { sum: 'exact' });
    // const { data, error } = await supabase.rpc('hello_world')
    // const result = await supabase.rpc('hello')
    const result = await supabase.rpc('get_user_levels_stats', { uid: 62801 }).single();

    res.status(200).json({ result: result.data })

}