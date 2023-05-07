
export default async function handler(req, res) {

    res.status(203).json({
        info: process.env.API_KEY
    });
} 