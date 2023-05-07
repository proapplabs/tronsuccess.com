
import jwt from 'jsonwebtoken';
import { getDB, getDomainTokenDB } from '@utils/v1/supabase'
import { pass } from '@utils/v1/crypt'
import { apiKeyControl, emptyBody, getApiKey } from '@utils/v1/api'

export default async function handler(req, res) {

    const DOMAIN_TOKEN = getApiKey(req, res)

    // let domain = await getDomainTokenDB(DOMAIN_TOKEN)
    // const domain = 
    res.status(200).json({
        a: req.body,
        b: req.header,
        user: {
            bg: "#a00",
            card: "rgba(255 255 255 / 10%)",
            primary: "purple",
            second: "blue",
            btnText: "green",
            text: "orange",
            gradient: {
                left: "#ffdb92",
                right: "#b18834",
                line: "linear-gradient(135deg, #00382c, #00836f);",
                inner: "#fff"
            },
        },
        auth: {
            bg: {
                url: "https://maabir.com/wp-content/uploads/2021/11/ruzgar-enerjisi-yatiriminin-riskleri-nelerdir-409_7999_o.jpg",
                opacity: 0.2,
                color: "#a00"
            },
            logo: "#fff",
            label: "#fff",
            border: "#a00",
            text: "orange",
            borderHover: "#a00",
            gradient: {
                left: "#ffdb92",
                right: "#b18834",
                inner: "#a00"
            },
            linkButton: "rgba(255 255 255 / 7%)"
        }

    })

}