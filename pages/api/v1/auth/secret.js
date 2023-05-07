
import jwt from 'jsonwebtoken';
const key = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEG";
export default async function handler(req, res) {
    const { token } = req.body
    const { admin } = jwt.verify(token, key) //  as { [key:string] : boolean } 

    const GET_API_KEY = getApiKey(req, res)
    const CORE_KEY = process.env.PRIVATE_AUTH_KEY

    if (admin) {
        res.json({ secretAdmin: 123456 })
    } else {
        res.json({ secretAdmin: false })
    }

}