import { apiKeyControl, getApiKey, emptyBody, getApiDecode } from '@utils/v1/api'
import { getFrontUserLoginDB, getDomainTokenDB, insertDB, visitorDB } from '@utils/v1/supabase'
export default async function handler(req, res) {

  apiKeyControl(req, res);
  emptyBody(req, res);
  const GET_API_KEY = getApiKey(req, res)
  const CORE_KEY = process.env.PRIVATE_AUTH_KEY
  let { phone, password, visitor } = req.body;



  if (!phone || !password || !visitor) {
    res.status(203).json({
      error: "Fill in the blank fields."
    })
  } else {
    const domain = await getDomainTokenDB(GET_API_KEY);
    if (domain) {
      let user = await getFrontUserLoginDB(domain.id, phone, password, visitor);
      if (user.error) {
        res.status(203).json({
          error: "Your information is incorrect. Please check your information."
        })
      } else {
        if (user.status == true) {
          let resultDatas = {
            levels: domain.levels,
            languages: domain.languages
          }
          resultDatas.user = user
          if (resultDatas.user) {
            res.status(200).json(resultDatas);
          } else {
            res.status(203).json({
              error: "Your information is incorrect. Please check your information."
            })
          }
        } else {
          res.status(203).json({
            error: "Your account has been blocked. Contact the support team."
          })
        }
      }
    } else {
      res.status(203).json({
        error: "Failed to login. Try again later."
      });
    }
  }
}  