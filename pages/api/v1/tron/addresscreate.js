import { addressCreate } from '@utils/v1/tron';
import { apiKeyControl, getApiKey } from '@utils/v1/api';
export default async function handler(req, res) {
  apiKeyControl(req, res)
  const GET_API_KEY = getApiKey(req, res)
  const CORE_KEY = process.env.PRIVATE_AUTH_KEY
  try {
    res.status(200).json(await addressCreate());
  } catch (e) {
    res.status(400).json(e);
  }
}
