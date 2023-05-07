import useTranslation from 'next-translate/useTranslation'
export default function GlobalPartners() {
    const { t, lang } = useTranslation('common');
    return (<>
        <section className="GlobalPartners">
            <h3>{t("global-partners")}</h3>
            <div>
                <img src='/img/logos/1.png' />
                <img src='/img/logos/2.png' />
                <img src='/img/logos/3.png' />

                <img src='/img/logos/4.png' />
                <img src='/img/logos/5.png' />
                <img src='/img/logos/6.png' />
            </div>
        </section>
        <style jsx>{`
        .GlobalPartners { border-radius: var(--radius); background-color: var(--bg-card-color); text-align: center; padding: 30px; }
.GlobalPartners h3 { margin: 0 0 30px 0; font-size: 21px; color: var(--text-color); font-weight: 500; letter-spacing: 1px; }
.GlobalPartners div { width: 100%;display: flex;margin-bottom:10px;}
.GlobalPartners div img { display: block; width: calc(100% / 6); }
@media (max-width:960px) {
  .GlobalPartners {padding: 15px;}
  .GlobalPartners h3{margin: 0 0 15px 0;font-size: 20px;}
  .GlobalPartners div{flex-wrap:wrap;}
  .GlobalPartners div img {width: calc(100% / 3);}
}
        `}</style>
    </>)
}