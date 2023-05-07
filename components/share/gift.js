import useTranslation from 'next-translate/useTranslation'
export default function Gift() {
    const { t, lang } = useTranslation('common');
    return (
        <section className='gift'>
            <img src="/img/icon/gift.png" />
            <div>
                <h3>{t("gift-title")}</h3>
                <p>{t("gift-content")}</p>
            </div>
            <style jsx>{`
.gift{width:370px;margin:auto;padding:15px;display:flex;align-items:center;position:relative;z-index:9999;background:var(--gradient); border-radius:var(--radius);color:var(--bg-color);}
.gift img{height:50px;margin-right:15px;}
.gift div *{margin:0;}
.gift div h3{font-size:16px;font-weight:normal;}
.gift div p{font-size:9px;color:var(--bg-color);}
@media (max-width:960px) {
    .gift{width:100%;}
}  
`}</style>
        </section>
    )
}