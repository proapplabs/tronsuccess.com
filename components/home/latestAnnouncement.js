import useTranslation from 'next-translate/useTranslation'
export default function LatestAnnouncement() {
    const { t, lang } = useTranslation('common');
    return (<>
        <section className="LatestAnnouncement">
            <a href="/notifications">
                <img src="/img/icon/question.png" width={40} />
                <div>
                    <h6>{t("the-common-problem")}</h6>
                    <p>{t("latest-announcement")}</p>
                </div>
            </a>
        </section>
        <style jsx>{`
        .LatestAnnouncement { background:linear-gradient(90deg,rgba(255,219,146,.08),rgba(177,136,52,.08)); padding: 0; border-radius: var(--radius); margin: 30px 0; }
.LatestAnnouncement * { margin: 0; }
.LatestAnnouncement a { display: flex; position: relative;align-items:center; }
.LatestAnnouncement a img{margin-right:15px;}
.LatestAnnouncement a span { color:white;font-size: 40px; font-weight: 400; background:linear-gradient(45deg,#ffdb92,#b18834); padding: 10px 20px 10px 15px; margin-right: 30px; border-radius: var(--radius) 100px 100px var(--radius); }
.LatestAnnouncement a div { padding: 10px 0; }
.LatestAnnouncement a div h6 { color: var(--white); font-size: 13px; font-weight: bold; margin-bottom: 5px; }
.LatestAnnouncement a div p { color: var(--white);font-size: 13px; font-weight: bold; }
.LatestAnnouncement a:after { transform:scale(0.6);content: " "; display: block; position: absolute; right: 20px; top: 0; bottom: 0; margin: auto; background-image: url(img/icon/arrow-right.png); background-size:contain;width: 12px; height: 24px; background-repeat: no-repeat; }
@media (max-width:960px) {
  .LatestAnnouncement{margin: 15px 0;}
  .LatestAnnouncement a span{font-size: 35px;}
  .LatestAnnouncement a div h6 {font-size: 14px;}
  .LatestAnnouncement a div p {font-size: 12px;}
}
        `}</style>
    </>)
}