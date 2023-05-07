import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react';
export default function PlatformDataDisplay() {
    const { t, lang } = useTranslation('common');
    const [profit, setProfit] = useState()
    const [membership, setMembership] = useState()
    useEffect(() => {
        const interval = setInterval(() => {
            setProfit(Math.ceil(new Date().getTime() / 2))
            setMembership(Math.ceil(new Date().getTime() / 50000))
        }, 1000);
        return () => clearInterval(interval);
    })
    return (
        <>
            <section className="PlatformDataDisplay">
                <h6>{t("platform-data-display")}</h6>
                <div>
                    <div>
                        <img src="/img/icon/platform/1.png" />
                        <h4>{profit}</h4>
                        <p>{t("accumulated-profit")}</p>
                    </div>
                    <div>
                        <img src="/img/icon/platform/2.png" />
                        <h4>{membership}</h4>
                        <p>{t("membership")}</p>
                    </div>
                </div>
            </section>
            <style jsx>{`
        .PlatformDataDisplay { margin: 30px 0; padding: 30px; background-color: var(--bg-card-color); border-radius: var(--radius); }
.PlatformDataDisplay * { margin: 0; }
.PlatformDataDisplay h6 { color: var(--text-color); font-size: 21px; font-weight: 500; letter-spacing: 1px; margin-bottom: 30px; text-align: center; }
.PlatformDataDisplay > div {display: flex; gap: 30px; justify-content: space-between;}
.PlatformDataDisplay > div div { display: block; width:145px;  text-align: center; padding: 30px 15px; background-color: rgba(255, 255, 255, 0.05); border-radius: var(--radius); }
.PlatformDataDisplay > div div img { width: 55px; }
.PlatformDataDisplay > div div h4 { font-weight: bold; }
.PlatformDataDisplay > div div p { font-size: 12px; opacity: 0.5; }
.PlatformDataDisplay > div> div:first-child{background:linear-gradient(315deg,rgba(245,239,255,.1),rgba(218,241,254,.1)) !important;}
.PlatformDataDisplay > div> div:last-child{background:linear-gradient(207deg,rgba(255,243,145,.1),rgba(255,184,0,.1))!important;}
@media (max-width:960px) {
    .PlatformDataDisplay {padding: 15px;margin: 15px 0;}
    .PlatformDataDisplay h6{font-size: 18px;margin: 0 0 15px 0;}
    .PlatformDataDisplay > div div img{width: 40px;}
    .PlatformDataDisplay > div div h4{font-size: 14px;}
    .PlatformDataDisplay > div div{padding: 15px;}
    .PlatformDataDisplay > div {gap: 15px; }
}
            `}</style>
        </>
    )

} 