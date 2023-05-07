import { getLevels } from '@utils/v1/tron';

import { apiKeyControl, getApiKey } from '@utils/v1/api';

export default async function handler(req, res) {

    const { amount, token } = req.body
    let created = Date.now()
    // const GET_API_KEY = getApiKey(req, res)
    res.status(200).json(
        await getLevels(amount)

    );
} 