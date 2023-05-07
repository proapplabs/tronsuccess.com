import { setCookie, hasCookie } from 'cookies-next';
export default async function handler(req, res) {

    setCookie('popupModal', true, { req, res })

    res.status(200).json({
        status: hasCookie('popupModal', { req, res })
    });
}    