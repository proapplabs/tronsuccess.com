
import { supabase } from '@utils/v1/supabase';
import { vi } from '@utils/visitor';
export default async function handler(req, res) {
    const sb = supabase();
    const withdrawal_status = true
    let { data, error } = await sb.from("users").select("*").limit(50)

    // const aa = vi(req);
    res.status(200).json({
        aa: data
    });
} 