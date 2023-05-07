import jwt from 'jsonwebtoken';
// import { apiKeyControl, getApiKey, emptyBody } from '@utils/v1/api';
// https://jwt.io/
export default async function handler(req, res) {

    // const GET_API_KEY = getApiKey(req, res)
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWV0cm9uLm1sIiwiaWF0IjoxNjUyNTUyNTk1LCJleHAiOjE2NjU3NzE3OTV9.G1zp--3ecthwUiMUeJH4i2Vj10Gr3-RsSSSBd0GAucw"
    const key = process.env.PRIVATE_AUTH_KEY
    // const getKey = "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEGe"
    // const getKey = "process.env.PRIVATE_AUTH_KEY"

    let created = 465245
    //   const jwtLogin = jwt.sign({ name: phone, iat: created, sub: "user" }, CORE_KEY);

    // jwt.verify(GET_API_KEY, CORE_KEY, function (err, decoded) {
    //     res.status(403).json({
    //         error: "Invalid token information"
    //     });
    // });
    // const decoded = jwt.verify(token, getKey, function ((e, b)=> {
    //     console.log(e)
    // }))

    // jwt.verify(token, getKey, function (err, decoded) {
    //     // console.log(decoded) // bar
    //     res.status(400).json({
    //         error: err.message
    //     });
    // });
    // jwt.verify(token, "a0tbplgr_i28fKGt8o3X6iW483VeVCyJjURWhdQEGe", function (err, decoded) {
    //     // console.log(decoded) // bar
    //     res.status(400).json({
    //         error: err.message,
    //         d: decoded
    //     });
    // });
    const { admin } = jwt.verify(token, key, function (err, decoded) {
        if (err) {
            res.status(400).json({
                error: err
            });
        } else {
            // res.status(400).json({
            //     decode: decoded
            // });
        }
    });

    res.status(200).json({
        data: "OK",
        dsf: admin
    });

}  