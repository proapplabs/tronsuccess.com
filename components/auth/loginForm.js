import { useRouter } from "next/router";
import HeadBox from '@components/headBox';
import Form from '@components/form';
import LayoutAuth from '@components/layoutAuth';
import useTranslation from 'next-translate/useTranslation'
import HomeSlider from '@components/home/homeSlider'
export default function LoginForm() {
    const { t, lang } = useTranslation();
    const router = useRouter()
    let { mobile, id } = router.query
    return (
        <LayoutAuth pageClass="login">
            <HeadBox title={t("common:login")} />

            <img src="/img/logo.png" className="logoAuth" />
            <Form
                card={false}
                btnTitle={t("common:sign-in")}
                btnReturnTitle={t("common:sign-up")}
                btnReturnUrl="/register"
                link="/api/login"
                redirect="/"
            >
                <input type="text" name="mobile" defaultValue={mobile ? true : false} hidden />
                <div>
                    <label>{t("common:mobile-number")}</label>
                    <input
                        type="number"
                        name="phone"
                        min={0}
                        pattern="[0-9]{3}"
                        required
                        autoComplete="off"
                        enterKeyHint="done" />
                </div>
                <div>
                    <label>{t("common:login-password")}</label>
                    <input
                        type="password"
                        name="password"
                        autoComplete="off"
                        enterKeyHint="done"
                        required />
                </div>
                <div className="checkbox remember">
                    <input type="checkbox" id="remember" name="remember" />
                    <label htmlFor="remember"></label>
                    <div>
                        <span>{t("common:remember-the-password")}</span>
                    </div>
                </div>
            </Form>
        </LayoutAuth>
    )
}
