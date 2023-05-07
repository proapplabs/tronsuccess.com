import jwt from 'jsonwebtoken';
import { apiKeyControl, getApiKey, emptyBody, clearData, getApi } from '@utils/v1/api';
import { addressCreate } from '@utils/v1/tron';
import { insertDB, getDomainTokenDB, getFrontUserLoginDB, getUserInviteCodeDB, getUserPhoneTotalDB, visitorDB, getUserTotalDB } from '@utils/v1/supabase';
import { pass } from '@utils/v1/crypt';

export default async function handler(req, res) {
  apiKeyControl(req, res)
  emptyBody(req, res)

  const GET_API_KEY = getApiKey(req, res)
  const CORE_KEY = process.env.PRIVATE_AUTH_KEY

  // Fields Control
  let { phone, password, password_secret, invite_code, visitor } = req.body


  if (!phone || !password || !password_secret || !invite_code || !visitor) {
    res.status(203).json({
      error: "Phone, Password, Secure Password and Invite Code fields are required."
    });
  } else {

    const domain = await getDomainTokenDB(GET_API_KEY)
    if (domain) {
      const domain_id = domain.id
      phone = clearData(phone, 'text');
      const userControl = await getUserPhoneTotalDB(domain_id, phone)
      if (userControl) {
        res.status(203).json({
          error: "This phone number is in use."
        });
      } else {
        invite_code = clearData(invite_code, 'text');

        const inviteCodeControl = await getUserInviteCodeDB(domain_id, invite_code)
        if (inviteCodeControl) {


          let wallet = await addressCreate();
          let promotion = await addressCreate();
          if (wallet && promotion) {

            let address_wallet = wallet.data.address
            let address_promotion = promotion.data.address

            wallet = pass(JSON.stringify(wallet.data), true)
            promotion = pass(JSON.stringify(promotion.data), true)
            let password_cryto = password
            password = pass(password, "pass")
            password_secret = pass(password_secret, "pass")
            let created = Date.now()

            let registerStart = domain.register_start
            if (registerStart) {
              let userTotal = await getUserTotalDB(domain_id)
              created = registerStart + userTotal + 1
            } else {

              created = Math.ceil(created / 100 * domain_id)
            }
            let jwtLogin = jwt.sign({ name: phone, iat: created, sub: domain.domain }, CORE_KEY);

            const saveDatas = {
              phone,
              password,
              password_secret,
              wallet,
              promotion,
              address_wallet,
              address_promotion,
              reference_code: invite_code,
              invite_code: created,
              token: jwtLogin,
              domain_id,
              domain: domain.domain
            }
            let addUser = await insertDB('users', saveDatas)
            if (addUser) {
              const logAdd = await visitorDB({
                action: "register",
                log: visitor,
                user_id: addUser,
                domain_id
              });
              // LOGIN  
              let user = await getFrontUserLoginDB(domain.id, phone, password_cryto, visitor);


              // RESULT
              res.status(200).json({
                data: "Registration successful.",
                login: null,
                user: user
              });
            } else {
              res.status(203).json({
                error: addUser.message
              });
            }
          } else {
            res.status(203).json({
              error: "An unexpected error has occurred. Please try again. If the error persists, contact us."
            });
          }
        } else {
          res.status(203).json({
            error: "You entered an invalid invite code."
          });
        }
      }
    } else {
      res.status(403).json({
        error: "Unauthorized operation."
      });
    }
  }
}  