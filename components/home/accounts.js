import useSWR from 'swr'
import { swrOptions, priceTrx } from '@utils/func'
import Loading from '../loading'
import useTranslation from 'next-translate/useTranslation'
export default function Accounts() {
    const { t, lang } = useTranslation('common');
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data.accounts)
    function Result(data) {
        if (!data) {
            data = {
                basic: {
                    trx: 0,
                    usd: 0
                },
                promotion: {
                    trx: 0,
                    usd: 0
                }
            }
        }
        return (
            <>
                <section className="accounts">
                    <img src="/img/icon/wallet/basic.png" />
                    <div>
                        <h6>{t("accounts-wallet")}<span>{t("accounts-account")}</span></h6>
                        <p>{priceTrx(data.basic.trx, false)} <span>TRX</span> ≈ $ {priceTrx(data.basic.usd, false)} </p>
                    </div>
                </section>
                <section className="accounts">
                    <img src="/img/icon/wallet/promotion.png" />
                    <div>
                        <h6>{t("accounts-promotion")}<span>{t("accounts-account")}</span></h6>
                        <p>{priceTrx(data.promotion.trx, false)} <span>TRX</span> ≈ $ {priceTrx(data.promotion.usd, false)} </p>
                    </div>
                </section>
                <style jsx>{`
.accounts { border-radius: var(--radius); background-color: var(--bg-card-color); display: flex; margin-bottom: 3px; align-items: center; transition: ease all 0.5s; position: relative; cursor: pointer; }
 
.accounts * { margin: 0; }
.accounts:nth-child(2) { margin-bottom: 1px !important; }
.accounts:after { transform:scale(0.6);content: " "; display: block; position: absolute; right: 15px; top: 0; bottom: 0; margin: auto; background-size:contain;background-image: url(img/icon/arrow-right.png); width: 12px; height: 24px; background-repeat: no-repeat; }
.accounts img { margin: 15px 30px; width: 50px; transition: ease all 0.5s; }
.accounts div h6 { font-size: 13px;margin-bottom: 5px;color:var(--white); }
.accounts div h6 span { display: inline-block; margin-left: 5px; font-size: 12px; font-weight: normal; color:#ffffff99;}
.accounts div p { color: var(--text-color); font-weight: bold; font-size: 15px; }
.accounts div p span { color: var(--text-white); font-size: 12px; font-weight: normal; }

@media (max-width:960px) {
    .accounts img{margin: 15px;}
    .accounts div h6{font-size: 14px;}
    .accounts div h6 span{font-size: 14px;}
    .accounts div p{font-size: 14px;font-weight: normal;}
    .accounts:after{right: 20px;}
}
            `}</style>
            </>
        )
    }
} 