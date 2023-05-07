import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubmitButton from '../submitButton';
import serialize from 'form-serialize';
import { alert } from '@utils/alert';
import { swrOptions, capitalize, getPrice, priceTrx } from '@utils/func'
import useTranslation from 'next-translate/useTranslation'
import Loading from '../loading';
import { useRouter } from "next/router";
export default function withdrawalForm() {
    const { t, lang } = useTranslation('common');
    const router = useRouter()
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    const [submitAction, setSubmitAction] = useState(false)
    const [account, setAccount] = useState('basic')
    const [max, setMax] = useState(0)
    const [min, setMin] = useState(0)
    const [quota, setQuata] = useState()
    const [balance, setBalance] = useState(0)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitAction(true)
        var form = document.querySelector('form');
        var obj = serialize(form, { hash: true });
        obj.action = account;
        if (!submitAction) {
            axios.post(
                '/api/withdrawal/control',
                obj
            ).then(function (response) {
                if (response.data.error) {
                    setSubmitAction(false)
                    alert('info', 'Information', response.data.error)
                } else {
                    setSubmitAction(false)
                    alert('success', 'Success', response.data.data)
                    router.push("/mine/profit/")
                }
            }).catch(function (error) {
                setSubmitAction(false)
                alert('info', 'Information', t("error-500"))
            });
        }

    }
    useEffect(() => {
        try {
            if (account == 'promotion') {
                setAccount('promotion')
                setMax(data.accounts.promotion.limit.max)
                setMin(data.accounts.promotion.limit.min)
                setBalance(data.accounts.promotion.trx)
            } else {
                setAccount('basic')
                setMax(data.accounts.basic.limit.max)
                setMin(data.accounts.basic.limit.min)
                setBalance(data.accounts.basic.trx)
            }
        } catch (e) {

        }
    });
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data = null) {
        const selectAccount = (value) => {
            setAccount(value)
            if (value == 'promotion') {
                setQuata("")
                setMax(data.accounts.promotion.limit.max)
                setMin(data.accounts.promotion.limit.min)
                setBalance(data.accounts.promotion.trx)
            } else {
                setQuata("")
                setMax(data.accounts.basic.limit.max)
                setMin(data.accounts.basic.limit.min)
                setBalance(data.accounts.basic.trx)
            }
        }
        const quotaMax = (e) => {
            setQuata(max)
        }
        return (
            <section className='withdrawal'>
                <section className="withdrawalButtons">
                    <span onClick={() => selectAccount('basic')} className={account == 'basic' ? 'active ' : ''}>
                        {t("accounts-basic")} {t("accounts-account")}
                    </span>
                    <span onClick={() => selectAccount('promotion')} className={account == 'promotion' ? 'active  ' : ''}>
                        {t("accounts-promotion")} {t("accounts-account")}
                    </span>
                </section>
                <section className="BasicAccountBalance">
                    <h3>
                        {account == "basic" ? (
                            t("basic-account-balance-trx")
                        ) : (
                            t("promotion-account-balance-trx")
                        )}
                    </h3>
                    <h4>{t("24-hour-settlement")}</h4>
                    <h1>{priceTrx(balance, false)}</h1>
                    <p>{t("daily-withdrawal-limit")} : <span>{max}</span></p>
                </section>
                <form method="post" autoComplete="off" onSubmit={handleSubmit}>
                    <div>
                        <span className='maxBox'>
                            <input
                                placeholder={t("quota") + "  0.01-1000000"}
                                type="text"
                                name="amount"
                                value={quota}
                                onChange={(e) => setQuata(e.target.value)}
                                autoComplete="off"
                                enterKeyHint="done" />

                        </span>
                        <small style={{ fontSize: 14 }}>Fee: 0.01, to account {max}</small>
                    </div>
                    <div>
                        <label></label>
                        <textarea
                            placeholder={t("address-start-with-t")}
                            type="text"
                            name="address"
                            autoComplete="off"
                            enterKeyHint="done"  ></textarea>
                    </div>
                    <div>
                        <label></label>
                        <input
                            placeholder={t("enter-your-security-password")}
                            type="password"
                            name="password"
                            autoComplete="off"
                            enterKeyHint="done" />
                    </div>
                    <div>
                        <SubmitButton action={submitAction} title={t("confirm")} />
                    </div>
                </form>
                <style jsx global>{`
                .withdrawal form{margin-bottom:0}
.BasicAccountBalance{padding: 30px 30px  0 30px; text-align: center;}
.BasicAccountBalance *{margin: 0;}
.BasicAccountBalance h1{font-size: 44px; color:var(--text-color);font-weight:700;margin:0;padding:0;} 
.BasicAccountBalance h3{font-size: 14px;margin-bottom:  5px;font-weight: normal;color:var(--white);}
.BasicAccountBalance h4{font-size: 14px;margin-bottom: 5px;font-weight: normal;color:var(--text-color);}
.BasicAccountBalance p{padding:0;margin:0;color:var(--white);font-size:14px;}
.BasicAccountBalance p span{ color:var(--text-color);}
.maxBox{position:relative;display:block;}
form small{font-size:12px;color:var(--text-color);font-weight:bold;}
form>div{padding:0;}
form>div:last-child{padding-top:15px;}
form input{background-color:rgba(0,0,0,.1);}
.maxBox .btn{border-radius:5px;position:absolute;right:7px;top:7px;padding:11px 10px;font-size:12px;z-index:999999;}
.withdrawalButtons{display:flex; justify-content:space-between;width:100%;}
.withdrawalButtons span{border:solid 1px rgba(255 255 255 / 20%); background-color:var(--bg-card-color);cursor:pointer;text-align:center;display:inline-block; color:var(--text-white);padding: 10px  15px; font-size: 14px;border-radius: var(--radius);}
.withdrawalButtons span.active{color:var(--text-color);border-color:var(--border-color);}
@media (max-width:960px) { 
    // .withdrawalButtons{padding:15px;margin:0 -15px;border-radius:0;}
    .withdrawalButtons span { font-size: 12px;} 
    .BasicAccountBalance{padding:15px 0 0 0;font-size:14px;}
    .BasicAccountBalance *{margin:0;padding:0;}
    .BasicAccountBalance h1{font-size:30px}
    .BasicAccountBalance h3{margin:0;}
  }
    `}</style>
            </section>
        )
    }
} 