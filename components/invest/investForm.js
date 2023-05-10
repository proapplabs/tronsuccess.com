import axios from 'axios';
import { useRouter } from "next/router";
import { alert } from '@utils/alert';
import Link from 'next/link'
import serialize from 'form-serialize';
import SubmitButton from '@components/submitButton';
import { swrOptions } from '@utils/func'
import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation'
import Loading from '../loading';

export default function InvestForm() {
    const { t, lang } = useTranslation('common');
    const [submitAction, setSubmitAction] = useState(false)
    const [copyStatus, setCopyStatus] = useState(t("copy-address"))
    const router = useRouter()
    const { action } = router.query

    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data)

    function Result(data = null) {
        console.log(data)
        const handleSubmit = async (e) => {

            setCopyStatus('Copy')
            e.preventDefault()
            setSubmitAction(true)
            var form = document.querySelector('#form');
            var obj = serialize(form, { hash: true });
            if (!submitAction) {
                axios.post(
                    '/api/invest/control',
                    obj
                ).then(function (response) {
                    // if (response.data.error) {
                    //     setSubmitAction(false)
                    //     alert('info', 'Information', response.data.error)
                    // } else {
                    //     setSubmitAction(false)
                    //     alert('success', 'Success', response.data.data)
                    //     router.push("/")
                    // }
                    router.push("/")
                }).catch(function (error) {
                    setSubmitAction(false)
                    alert('error', 'Error', t("error-500"))
                });
            }

        }

        let address = null
        let qr = null
        let min = 0.01
        if (action == 'basic') {
            address = data.accounts.basic.address
            qr = data.accounts.basic.qr
            min = data.accounts.basic.limit.min
        } else if (action == 'promotions') {
            address = data.accounts.promotion.address
            qr = data.accounts.promotion.qr
            min = data.accounts.promotion.limit.min
        }

        if (!address) {
            return (
                <section className='investForm'>
                    <h1 className='pageTitle'>
                        {action == 'basic' ? (
                            t("transfer-to-basic-account")
                        ) : (
                            t("transfer-to-promotion-account")
                        )}
                    </h1>
                    <div className='infoBox '>
                        <p>
                            {action == 'basic' ? (
                                t("invest-recharge-basic-no-address-message")
                            ) : (
                                t("invest-recharge-promotion-no-address-message")
                            )}
                        </p>
                        <Link href="/logout">
                            <a className='btn-gradient'>{t("now-log-in-again")}</a>
                        </Link>
                    </div><style jsx>{`
   .infoBox{background-color:var(--bg-card-color);padding:30px;text-align:center;border-radius:var(--radius)} 
   .infoBox p{line-height:20px;}
    `}</style>
                </section>
            )
        }

        const copy = () => {
            // alert('success', 'Success', "Address copied")
            setCopyStatus(t("address-copied"))
            navigator.clipboard.writeText(address);
        }

        return (
            <section className='investForm'>
                <div className='pageTitle'>
                    <Link href="/invest/recharge">
                        <a className='back'><i className='fa fa-chevron-left'></i></a>
                    </Link>
                    <h1 >
                        Invest Products
                    </h1>
                </div>
                <div className="qrText">
                    <p className='t1'>
                        {action == 'basic' ? (
                            t("transfer-to-basic-account")
                        ) : (
                            t("transfer-to-promotion-account")
                        )}
                    </p>
                    <img src={qr} alt="" className='qr' />
                    <p className='color'>{t("trx-address")}</p>
                </div>
                <form id="form" method="post" onSubmit={handleSubmit}>
                    <input type="text" name="action" defaultValue={action} hidden />
                    <div>
                        <div className='clipboard'>
                            <input id="address" type="text" defaultValue={address} disabled />
                            <input
                                id="address"
                                type="text"
                                name="address"
                                defaultValue={address}
                                required
                                autoComplete="off"
                                enterKeyHint="done"
                                hidden />
                            <button type="button" className={'copy btn-gradient  ' + copyStatus} onClick={(e) => copy()}>{copyStatus}</button>
                        </div>
                        <div>
                            <p>{t("invest-recharge-basic-message-0", { minutes: "5~10" })} </p>
                            <p className='text-color'>{t("invest-recharge-basic-message-1", { minimum: min })} </p>
                        </div>
                    </div>
                    <div className='buttons'>
                        <SubmitButton action={submitAction} title={t("recharge-completed")} />
                        {/* <button type="button" className={'copy ' + copyStatus} onClick={(e) => copy()}>{copyStatus}</button> */}
                    </div>
                </form>
                <style jsx>{`  
                .pageTitle{text-align:left}
                .pageTitle h1{margin-left:45px !important; }
                .qrText{text-align:center;margin-top:-70px;}
                .text-color{color:var(--text-color)}
                .qrText .color{color:var(--text-color);margin-top:10px;}
   .investForm form{margin:15px -30px;padding:  30px;}
   .investForm input{padding:10px ; border-color:  hsla(0,0%,100%,.2) !important;background-color:rgba(0,0,0,.1);}
   .investForm .qr{width:140px;margin:auto;display:block; }
   .investForm .buttons{display:flex;gap:15px;} 
   .investForm p.t1{font-size:14px;color:white;font-weight:bold;}
   .investForm p{font-size:14px; padding:5px 5px}
   .clipboard{position:relative;}
   .clipboard textarea{padding-right:40%;max-height:38px !important; min-height:38px !important;}
   .clipboard span{position:absolute;right:0;bottom:0;border-radius:5px;cursor:pointer;}
   .clipboard button{position:absolute;height:100%;right:0; width:auto;bottom:0;padding:7px 15px; font-size:12px !important;
 border-radius:0 var(--radius) var(--radius) 0
}
    `}</style>
            </section >


        )
    }
}
