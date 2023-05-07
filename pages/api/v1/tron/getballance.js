import { getBalance } from '@utils/v1/tron';

import { apiKeyControl, getApiKey } from '@utils/v1/api';

export default async function handler(req, res) {

  // const { address, wallet } = req.header
  const { address } = req.body
  // const GET_API_KEY = getApiKey(req, res)
  res.status(200).json(
    await getBalance(address)
  );

}

/*
TEST : TRkKSEzwj7b1sasn8LxkACpgSacJbbWMUH
ABDULLAH : TZEJvr4cc4JiE8repgYSZUDWqMG3kPVJWP


*/