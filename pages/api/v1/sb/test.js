// import jwt from 'jsonwebtoken';
// import { apiKeyControl, getApiKey, emptyBody } from '@utils/v1/api';
// import { getAllDatas } from '@utils/v1/supabase';
// import AES from 'crypto-js/aes'; 
import { pass } from '@utils/v1/crypt';

export default async function handler(req, res) {

    let { sifreli } = req.body

    res.status(200).json({
        // data: crypt.secret
        // en: pass("asd4564646", true),
        coz: JSON.parse(pass(sifreli, false)),
        gelen: sifreli
    });
}  