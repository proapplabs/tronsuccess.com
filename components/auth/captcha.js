import Script from "next/script";
import Image from "next/image";
import useTranslation from 'next-translate/useTranslation'
import { useState } from "react";
export default function Captcha() {


    const { t, lang } = useTranslation('common');
    const [img, setImg] = useState("/api/captcha")
    const refresh = () => {
        const url = "/api/captcha"
        fetch(url, { cache: 'reload', mode: 'no-cors' })
            .then(() => document.body.querySelectorAll(`img[src='${url}']`).forEach(img => (img.src = url)))
            .catch(e => console.log('error', e));
    }


    return (
        <div className="captcha">
            <input
                name="code"
                required
                placeholder={t("attach")}
                autoComplete="off"
                enterKeyHint="done"
            />
            <img src={img} className="img" width={80} height={30} onClick={() => refresh()} />
            <style jsx>{`
         
         .captcha{position:relative;}
         .captcha .img{position:absolute;right:10px;top:10px}
         @media (max-width:960px) {
             
         }
             `}</style>
        </div>
    )
}