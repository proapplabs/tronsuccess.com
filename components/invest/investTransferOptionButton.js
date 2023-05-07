import Link from "next/link"
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

export default function InvestTransferOptionButton() {
    const { t, lang } = useTranslation('common');
    const router = useRouter()
    return (
        <>
            <section className="recharge">
                <div className="links">
                    <Link href="/invest/recharge/basic" >
                        <a className="BasicAccount ">
                            <img src="/img/icon/invest/1.png" alt="" />
                            <p>{t("transfer-to-basic-account")}</p>
                        </a>
                    </Link>
                    <Link href="/invest/recharge/promotions" >
                        <a className="PromotionAccount">
                            <img src="/img/icon/invest/2.png" alt="" />
                            <p>{t("transfer-to-promotion-account")}</p>
                        </a>
                    </Link>
                </div>
                <div className="text">
                    <h3>{t("invest-recharge-0")}</h3>
                    <ol>
                        <li>{t("invest-recharge-1", { city: "Singapore", time: "24:00" })}</li>
                        <li>{t("invest-recharge-2")}</li>
                    </ol>
                    <h3>{t("invest-recharge-3")}</h3>
                    <p>{t("invest-recharge-4")}</p>
                </div>
            </section>
            <style jsx>{`
.recharge .links{display: flex;gap:30px;text-align: center;justify-content:space-between;}
.recharge .links a{width:160px;transition: ease all 0.5s;cursor: pointer; padding: 30px;display: block;border-radius: var(--radius);background-color: var(--bg-card-color);}
.recharge .links a img{height: 55px;transition: ease all 0.5s;}
.recharge .links a p{margin: 15px 0 0 0;font-size:14px;} 
.recharge .text{padding: 30px;border-radius: var(--radius);background-color: var(--bg-card-color);margin-top: 30px;}
.recharge .text ol,
.recharge .text ul{padding: 0 0 0 17px;}
.recharge .text li{padding-bottom: 10px;}
.recharge .text li:last-child{padding: 0;}
.recharge .text h3{color:var(--text-white);font-weight:normal;font-size:14px;}
.recharge .text p{font-size:14px;}
.recharge .text *{color:var(--text-white);}

@media (max-width:960px) {
  .recharge{padding-top: 15px;}
  .recharge .text{padding: 15px;margin-top: 15px;font-size: 14px;}
  .recharge .text h3{margin: 0;}
  .recharge .links{gap:15px}
  .recharge .links  a {padding: 15px;}
  .recharge .links  a img{height: 40px;}
  .recharge .links  a  p{font-size:12px;}
}
`}</style>
        </>
    )
} 