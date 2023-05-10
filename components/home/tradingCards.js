import Link from "next/link";
import useTranslation from 'next-translate/useTranslation'
export default function TradingCards() {
    const { t, lang } = useTranslation('common');
    return (<>
        <section className="TradingCards">
            <h6> {t("trading-cards-title")}</h6>
            <p>{t("trading-cards-content")}</p>
            <img src="/img/bg/join.png" />
            <br />
            <Link href="/trading"  ><a className="btn bg-gradient">{t("details")}</a></Link>
        </section>
        <style jsx>{`
        .TradingCards { background-color: var(--bg-card-color); padding: 30px; text-align: center; border-radius: var(--radius); margin: 30px 0; }
.TradingCards * { margin: 0; }
.TradingCards h6 { color: var(--text-color); font-size: 20px; font-weight: normal; margin-bottom: 10px; }
.TradingCards p { font-size: 14px; color:white; }
.TradingCards img { width: 50%; }
.TradingCards a{padding:7px  0px;display:inline-block;border-radius:100px;color:var(--bg-color);font-size:14px;width:101px;}
@media (max-width:960px) {
  .TradingCards {padding: 15px;margin: 15px 0;}
  .TradingCards h6{font-size: 17px;}
  .TradingCards p{font-size: 14px; }
  .TradingCards a{font-size: 14px; }
}
        `}</style>
    </>)
}