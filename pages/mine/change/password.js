import { userControl } from '@utils/crypt'
import Layout from '@components/layout'
import Form from '@components/form'
import Link from 'next/link'
import HeadBox from '@components/headBox'
import useTranslation from 'next-translate/useTranslation'

export default function PasswordChange() {
    const { t, lang } = useTranslation('common');
    return (
        <Layout>
            <HeadBox title="Password Change" />
            <div className='pageTitle'>

                <Link href="/mine" ><a className='back'><i className='fa fa-chevron-left'></i></a></Link>
                <h1>{t("change-password")}</h1>
            </div>
            <Form link="/api/mine/password">
                <input type="text" name="action" value="password" hidden />
                <div>
                    <input type="password" name="oldPass" placeholder={t("old-password")} style={{ borderColor: "rgba(255 255 255 / 20%)" }} />
                </div>
                <div>
                    <input type="password" name="newPass" placeholder={t("new-password")} style={{ borderColor: "rgba(255 255 255 / 20%)" }} />
                </div>
                <div>
                    <input type="password" name="newPassConfirm" placeholder={t("confirm-password")} style={{ borderColor: "rgba(255 255 255 /20%)", marginBottom: 15 }} />
                </div>
            </Form>
        </Layout>
    )
}
export async function getServerSideProps(context) {
    return userControl(context, {
    })
}
