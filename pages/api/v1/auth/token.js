import jwt from 'jsonwebtoken';
// https://jwt.io/
export default async function handler(req, res) {
  if (!req.body) {
    res.status(404).json({
      message: "Error"
    });
  }
  // const GET_API_KEY = getApiKey(req, res)
  const CORE_KEY = process.env.PRIVATE_AUTH_KEY

  const { domain, deadline } = req.body

  let created = Date.now()
  if (!domain && !created && !deadline) {
    res.status(404).json({
      message: "Complete the missing parameters."
    });
  }

  const jwtLogin = jwt.sign({ name: domain, iat: created, exp: deadline }, CORE_KEY);
  res.status(200).json({
    // data:req.body
    token: jwtLogin
  });
}  