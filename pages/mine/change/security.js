import Layout from "@components/layout";
import Form from '@components/form'
import Link from "next/link";
import HeadBox from "@components/headBox";
import useTranslation from 'next-translate/useTranslation'

export default function SecurityChange() {
    const { t, lang } = useTranslation('common');
    return (
        <Layout>
            <HeadBox title="Security Password Change" />
            <div className='pageTitle'>
                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>{t("change-security-password")}</h1>
            </div>
            <Form link="/api/mine/password">
                <input type="text" name="action" value="secret-password" hidden />
                <div>
                    <input type="password" name="oldPass" placeholder={t("old-security-password")} />
                </div>
                <div>
                    <input type="password" name="newPass" placeholder={t("new-security-password")} />
                </div>
                <div>
                    <input type="password" name="newPassConfirm" placeholder={t("confirm-security-password")} />
                </div>
            </Form>
        </Layout>
    )
}