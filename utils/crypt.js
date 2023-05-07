
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';
// import { getCookies, getCookie, setCookie, deleteCookie, hasCookie } from 'cookies-next';
import { getCookie, setCookie, hasCookie } from 'cookies-next';

export function changeLanguage(lang, req, res) {
    let account = getAccountDatas(req, res);
    if (account) {
        account.language = lang
        setAccountDatas(req, res, account);
    }
}
export function security(data, status) {

    const crypt = {
        // (B1) THE SECRET KEY
        secret: "32c647602ab4c4c7543e9c50ae25e567c3354e1532b11649ce308e6e2568d205",

        // (B2) ENCRYPT
        encrypt: (clear) => {
            var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
            cipher = cipher.toString();
            return cipher;
        },
        pass: (clear) => {
            var cipher = CryptoJS.HmacSHA256(clear, crypt.secret);
            cipher = cipher.toString();
            return cipher;
        },

        // (B3) DECRYPT
        decrypt: (cipher) => {
            var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
            decipher = decipher.toString(CryptoJS.enc.Utf8);
            return decipher;
        }
    };
    if (status) {
        if (status == "pass") {
            return crypt.pass(data)
        } else {
            return crypt.encrypt(data)
        }
    } else {
        return crypt.decrypt(data)
    }
}


export function getAccountDatas(req, res, datas = null) {
    const data = getCookie('init', { req, res });
    if (data) {
        return JSON.parse(security(data, false));
    } else {
        return null
    }
}
export function setAccountDatas(req, res, datas) {

    // Datas 
    const convert = security(JSON.stringify(datas), true);
    setCookie('init', convert, { req, res })
    // Token
    const token = security(datas.user.token, true)
    const tokenDecode = security(token, false)
    setCookie("user_token", token, { req, res });
    // Result
    return hasCookie('init', { req, res });
}

export function cookieCoreUpdate() {
    const now = new Date();
    const dateline = new Date(now.getTime() + 1000 * 30);
    // 1664227272475
    if (now.getTime() >= dateline.getTime()) {
        return true
    } else {
        return false
    }
}
export function userControl(context, datas = null) {
    if (hasCookie('user_token', context) && hasCookie('init', context)) {

        return {
            props: datas
        }
    } else {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
            props: {

            }
        }
    }
}