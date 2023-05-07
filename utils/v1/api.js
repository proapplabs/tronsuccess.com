import jwt from 'jsonwebtoken';
export function apiKeyControl(req, res) {
    if (!req.headers['rm-api-key']) {
        return res.status(203).json({
            error: 'Your API KEY information could not be found. Please add your key information.'
        });
    }
    const GET_API_KEY = req.headers['rm-api-key']
    const CORE_KEY = process.env.PRIVATE_AUTH_KEY
    jwt.verify(GET_API_KEY, CORE_KEY, function (err, decoded) {
        if (err) {
            res.status(203).json({
                error: err.message
            });
        } else {
            // res.status(400).json({
            //     decode: decoded
            // });
        }
    });
}
export function emptyBody(req, res) {
    if (!req.body) {
        res.status(203).json({
            message: "Complete the missing information."
        });
    }
}
export function getApiKey(req, res) {
    if (req.headers['rm-api-key']) {
        return req.headers['rm-api-key'];
    } else {
        return false;
    }
}
export function getApiDecode(req, res) {
    const GET_API_KEY = req.headers['rm-api-key']
    const CORE_KEY = process.env.PRIVATE_AUTH_KEY
    let data = jwt.verify(GET_API_KEY, CORE_KEY);
    return data;
    // jwt.verify(GET_API_KEY, CORE_KEY, function (err, decoded) {
    //     if (err) {
    //         return err.message
    //         // res.status(400).json({
    //         //     error: err.message
    //         // });
    //     } else {
    //         return decoded
    //         // res.status(400).json({
    //         //     success: decoded
    //         // });
    //     }
    // });
}

export function clearData(data, action) {
    return data.replace(/[^0-9]/g, '')
    // if (action == "text") {
    //     return data.replace(/[^0-9]/g, '')
    // } else if (action == "number") {
    //     return data.replace(/[^a-zA-Z]/g, '')
    // } else {
    //     return "error"
    // }
} 