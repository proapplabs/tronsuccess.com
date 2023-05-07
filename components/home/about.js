import useTranslation from 'next-translate/useTranslation'
export default function About() {
    const { t, lang } = useTranslation('common');
    return (<>
        <section className="About">
            <h5>{t("about-title")}</h5>
            <h6>{t("about-subtitle")}</h6>
            <img src="/img/bg/about.png" />
            <p>{t("about-content")}</p>
        </section>
        <style jsx>{`
        .About { background-color: var(--bg-card-color); padding: 30px; text-align: center; border-radius: var(--radius); margin-bottom: 30px; }
.About * { margin: 0; }
.About h5 { color: white; font-size: 13px; font-weight: normal; margin-bottom: 0px; }
.About h6 { color: var(--text-color); font-size: 20px; font-weight: normal; margin-bottom: 20px; }
.About p { font-size: 13px; width:70%;margin:auto; }
.About img { width: 50%; }
{/* .About .icon { width: 100%;background-image:url('/v1/icon_about.png');height:200px;background-size:contain;background-repeat:no-repeat;margin:auto;background-position:center;} */}
.About a { display: inline-block; background: linear-gradient(90deg, #ffdb92, #b18834); color: white; padding: 10px 30px; border-radius: 100px; font-weight: 600; letter-spacing: 1px; font-size: 16px; filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.5)); }
@media (max-width:960px) {
  .About {padding: 15px;margin: 15px 0;}
  .About h6{margin-bottom: 15px;}
  .About p{font-size: 14px;line-height: 20px;}
}
        `}</style>
    </>)
}