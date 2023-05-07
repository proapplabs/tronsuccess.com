
import CryptoJS from 'crypto-js';
export function pass(password, status) {
    if (password) {
        const crypt = {
            // (B1) THE SECRET KEY
            secret: process.env.PRIVATE_AUTH_KEY,
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
                return crypt.pass(password)
            } else {
                return crypt.encrypt(password)
            }
        } else {
            try {
                return crypt.decrypt(password)
            } catch (error) {
                return false
            }
        }
    } else {
        return false
    }
}