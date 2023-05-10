
import Layout from "@components/layout";
import Form from "@components/form";
import Link from "next/link";
import HeadBox from "@components/headBox";
import BalancesCard from "@components/mine/balancesCard";
import useTranslation from 'next-translate/useTranslation'


export default function Transfer() {
    const { t, lang } = useTranslation('common');
    return (
        <Layout>
            <HeadBox title="Transfer to Basic" />
            <div className='pageTitle'>
                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>Transfer To Basic</h1>
            </div>
            <BalancesCard />
            <section className="transfer">
                <Form link="/api/mine/transfer">
                    <div>

                        <input placeholder={t("quantity-to-be-converted")} type="text" min="0" name="amount" autoComplete="new-password" style={{ borderColor: "rgba(255 255 255 / 20%)" }} />
                        {/* <small>You can transfer a maximum of 17 TRX.</small> */}
                    </div>
                    <div>
                        <input placeholder={t("enter-your-security-password")} type="password" min="0" name="password" autoComplete="new-password" style={{ borderColor: "rgba(255 255 255 /20%)", marginBottom: 15 }} />
                    </div>
                </Form>
                {/* <p className="infoBox text-center">{t("the-transfer-process-takes-2-3-minutes")}</p> */}
            </section>
            <style jsx>{` 
            *{-webkit-tap-highlight-color:transparent !important;}
            .transfer{margin:0 -10px;}
@media (max-width:960px) {
 
}
    `}</style>
        </Layout>
    )
}