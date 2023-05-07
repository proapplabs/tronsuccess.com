import { useRouter } from "next/router";
import HeadBox from '@components/headBox';
import Form from '@components/form';
import LayoutAuth from '@components/layoutAuth';
import useTranslation from 'next-translate/useTranslation'
import Captcha from "./captcha";

export default function RegisterForm() {
    const { t, lang } = useTranslation('common');
    const router = useRouter()
    const inviteCodeControl = () => {
        let path = router.asPath
        if (path) {
            const match = path.match(/[\?&]id=([^&#]*)/);
            const id = match ? match[1] : null;
            if (id) {
                return id
            } else {
                path = path.split('/')
                if (path[2]) {
                    return path[2]
                }

            }
        }
    }
    return (
        <LayoutAuth pageClass="register">
            <HeadBox title="Register" />
            <Form
                card={false}
                btnTitle={t("sign-up")}
                btnReturnTitle={t("sign-in")}
                btnReturnUrl="/login"
                link="/api/register"
                redirect="/"
            >
                <div>
                    <input
                        type="number"
                        name="phone"
                        pattern="[0-9]{3}"
                        placeholder={t("phone-number")}
                        required
                        autoComplete="off"
                        enterKeyHint="done"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder={t("password")}
                        required
                        autoComplete="off"
                        enterKeyHint="done"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        name="password_secret"
                        placeholder={t("security-password")}
                        required
                        autoComplete="off"
                        enterKeyHint="done"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        name="invite_code"
                        placeholder={t("invite-code")}
                        min="0"
                        defaultValue={inviteCodeControl()}
                        required
                        autoComplete="off"
                        enterKeyHint="done"
                    />
                </div>
                <Captcha />

            </Form>
        </LayoutAuth>
    )
} 
