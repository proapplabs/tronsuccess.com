import axios from 'axios';
import { useRouter } from "next/router";
import { alert } from '@utils/alert';
import serialize from 'form-serialize';
import { security } from '@utils/crypt';
import SubmitButton from '@components/submitButton';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation'

export default function From({ link, children, redirect, refresh, card, btnTitle = null, btnReturnTitle, btnReturnUrl }) {
    const [submitAction, setSubmitAction] = useState(false)
    const router = useRouter()
    const { t, lang } = useTranslation('common');
    if (btnTitle == null) {
        btnTitle = t("confirm")
    }
    const formToken = security("Super!User2022#@", true)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitAction(true)
        let { mobile } = router.query
        var form = document.querySelector('#form');
        var obj = serialize(form, { hash: true });
        obj.mobile = mobile ? true : false
        if (!submitAction) {
            axios.post(
                link,
                obj
            ).then(function (response) {
                if (response.data.error) {
                    setSubmitAction(false)
                    alert('info', 'Information', response.data.error)
                } else {
                    setSubmitAction(false)
                    alert('success', 'Success', response.data.data)
                    if (redirect) {
                        router.push(redirect)
                    }
                }
                if (refresh) {
                    router.reload(window.location.pathname);
                }
            }).catch(function (error) {
                setSubmitAction(false)
                alert('error', 'Error', t("error-500"))
            });
        }
    }
    return (
        <form id="form" className={card ? "" : 'card-none'} method="post" onSubmit={handleSubmit}>

            <input type="text" name="token" defaultValue={formToken} hidden />
            {children}
            <div>
                <SubmitButton action={submitAction} title={btnTitle} />
            </div>
            {btnReturnUrl ? (
                <div className="">
                    <Link href={btnReturnUrl}>
                        <span className="btn-register btn-outline">{btnReturnTitle}</span>
                    </Link>
                </div>
            ) : (
                ''
            )}
            {link == "/api/register" ? (
                <div className="checkbox encrypted">
                    <label htmlFor="encrypted"></label>
                    <input type="checkbox" id="encrypted" name="encrypted" />
                    <div>
                        <span>{t("register-encrypted-title")}</span>
                        <small>{t("register-encrypted-content")}</small>
                    </div>
                </div>
            ) : null}


        </form>
    )
}
