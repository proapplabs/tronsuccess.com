import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { alert } from '@utils/alert';
import { swrOptions } from '@utils/func'
import useTranslation from 'next-translate/useTranslation'
import Loading from '../loading';
export default function ShareCard() {
    const { t, lang } = useTranslation('common');
    const [copyStatus, setCopyStatus] = useState('copy')
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data = null) {
        const copy = (link) => {
            alert('success', 'Success', t("copied-invite-code-message"))
            setCopyStatus('copy')
            setCopyStatus('copied')
            navigator.clipboard.writeText(link);
        }
        if (!data.share) {
            return <Loading />
        }
        let link = data.share.link
        let domain = data.account.user.domain
        link = link.replace("https://" + domain + "/register/", "https://" + domain + "/#/pages/login/register?id=")
        return (
            <>
                <section className="shareCard">
                    <h1> {t("share-card-title")}</h1>
                    <p> {t("share-card-subtitle")}</p>
                    <div className='qrBox'>
                        <img src={data.share.imageLink} />
                    </div>
                    <div href={link} className="copyBox">
                        <span>{link}</span>
                        <div>
                            <b className='copy' onClick={(e) => copy(link)}>{t("copy-link")}</b>
                        </div>
                    </div>
                </section>

                <style jsx>{`
.shareCard .qrBox{position:relative;display:block;padding-bottom:180px;}
.shareCard .qrBox:after{content:' ';display:block;z-index:-1;position:absolute;bottom:0;left:0;right:0;top:0;background-image: url(/img/bg/share.png);background-position: bottom center;background-size: 100% 240px;background-repeat: no-repeat;}
.shareCard .qrBox:before{content:' ';display:block;z-index:-1;position:absolute;bottom:0;left:0;right:0;top:-30%;background-image: url(/img/bg/share-bg.png);background-position: top center;background-size: 50% auto;background-repeat: no-repeat;}
.shareCard .qrBox img { position:relative;z-index:999;display: block; border:solid 10px var(--text-color);max-width: 160px; border-radius: var(--radius); margin: auto; }
.shareCard { text-align: center; padding: 30px 0;position:relative;z-index:9999999; }
.shareCard h1 { margin: 0 0 0 0; font-size: 20px; color: var(--text-color); font-weight: 600; }
.shareCard p { margin: 7px 0 30px 0; font-size: 15px;color:white; }
.shareCard .copyBox {position:relative;z-index:999;width:370px; display:flex;align-items:center;margin: -40px auto auto auto; border: var(--border-color) solid 1px; border-radius: var(--radius); background-color: var(--bg-card-color); transition: ease all 0.5s; }
.shareCard .copyBox span {color:white;font-size:11px;  max-width:calc(100% - 74px);padding:15px ;border-radius:var(--radius);word-wrap: break-word; display: inline-block; text-align:left !important; }
.shareCard .copy {margin:8px;font-size:13px; font-weight:normal;min-width:74px;background: var(--gradient); display: inline-block; border-radius: 100px; padding: 5px 0 ;  color: var(--bg-color);   transition: ease all 0.5s; }
.shareCard .copyBox:active b { background: white; }
@media (max-width:960px) {
  .shareCard{padding: 30px 0;}
  .shareCard h1{font-size: 18px;}
  .shareCard p{font-size: 13px;}
  .shareCard img{width: 50%;}
  .shareCard .copy{margin: 15px 0 0 0;}
  .shareCard .copyBox{ max-width:100%; }
  .shareCard .copyBox span{ width:70%;text-align:center;}
  .shareCard .qrBox{padding-bottom:150px;}
  .shareCard .qrBox:after{width:100%;margin:auto;background-size:150% 240px;}
}
    `}</style>

            </>
        )

    }
} 