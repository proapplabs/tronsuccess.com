import useTranslation from 'next-translate/useTranslation'

import { useRouter } from 'next/router'
import TopMenu from "../topMenu"
export default function InvestMenu() {
    const { t, lang } = useTranslation('common');

    const router = useRouter()
    const links = [
        {
            "title": t("products"),
            "link": "/invest/products"
        },
        {
            "title": t("recharge"),
            "link": "/invest/recharge"
        },
        {
            "title": t("invest-list"),
            "link": "/invest/list"
        }
    ]
    return (<TopMenu links={links} />)
} 