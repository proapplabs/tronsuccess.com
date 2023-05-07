import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import serialize from 'form-serialize';
import axios from 'axios';
import SubmitButton from '@components/submitButton';
import { getPrice, swrOptions } from '@utils/func'
import { alert } from '@utils/alert';
import Loading from '../loading';
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

export default function InvestProduct() {
    const { t, lang } = useTranslation("common");
    const router = useRouter();
    const { id } = router.query
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/invest/product?id=' + id, fetcher, swrOptions('datas'))
    const [calc, setCalc] = useState()
    const [submitAction, setSubmitAction] = useState(false)
    const calculate = () => {
        // e.preventDefault()
        var form = document.querySelector('form');
        var obj = serialize(form, { hash: true });
        const price = obj.price
        const day = obj.day
        const rate = obj.rate
        const total = getPrice((price * rate * day) / 100)
        setCalc('' + price + ' + ( ' + price + ' * ' + rate + ' * ' + day + ' ) = ' + total + ' TRX')
    }
    useEffect(() => {
        calculate()
    });

    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data) {
        const handleSubmit = async (e) => {
            e.preventDefault()
            setSubmitAction(true)
            var form = document.querySelector('form');
            var str = serialize(form);
            var obj = serialize(form, { hash: true });
            setSubmitAction(false)

            if (!submitAction) {
                axios.post(
                    '/api/invest/register',
                    obj
                ).then(function (response) {
                    if (response.data.error) {
                        setSubmitAction(false)
                        alert('info', 'Information', response.data.error)
                    } else {
                        router.push("/mine/minings")
                        alert('success', 'Success', response.data.data)

                    }
                }).catch(function (error) {
                    setSubmitAction(false)
                    alert('info', 'Information', t("error-500"))
                });
            }
        };

        return (
            <>
                <div className="container product">
                    <section className="head">
                        <div className="text">
                            <p>{t("promotion-account-balance")}</p>
                            <h4>{getPrice(data.promotion_total)}  </h4>
                        </div>
                        <img src="/img/bg/product.png" alt="" />
                    </section>
                    <section className="detail">
                        <div><p>{t("start-amount")} </p><span>{data.start_amount}  </span></div>
                        <div><p>{t("max-investment-amount")} </p><span>{data.max_amount}  </span></div>
                        <div><p>{t("cycle")} </p><span>{data.crcle} {t("day")}</span></div>
                        <div><p>{t("daily-interest-rate")} </p><span>{data.rate} %</span></div>
                        <div><p>{t("number-of-investments")} </p><span>99</span></div>
                    </section>
                    <section className="formBox" autoComplete="off">
                        <form method="post" onSubmit={handleSubmit}>
                            <input type="number" name="id" defaultValue={data.id} hidden />
                            <input type="number" name="day" defaultValue={data.crcle} hidden />
                            <input type="number" name="rate" defaultValue={data.rate} hidden />
                            <section>
                                <div>
                                    <label>{t("promotion-account")}</label>
                                    <input type="number"
                                        name="price"
                                        onChange={(e) => calculate(e)}
                                        defaultValue={data.start_amount}
                                        min={data.start_amount}
                                        max={data.max_amount}
                                        autoComplete="new-password"
                                        required />
                                </div>
                                <div>
                                    <label>{t("security-password")}</label>
                                    <input type="password" name="password" onChange={(e) => calculate(e)} autoComplete="new-password" required />
                                </div>
                            </section>
                            <span className="result">{calc}</span>
                            <SubmitButton action={submitAction} title={t("participate-in-investment")} />
                            <p className='message'>{t("invest-product-message")}</p>
                        </form>
                    </section>
                </div>
                <style jsx>{`
                
  .product .head{padding: 15px;margin-bottom:30px;border-radius: var(--radius);display: flex;background:var(--gradient);align-items: center;justify-content: center;}
  .product .head>div{width: 100%;}
  .product .head img{height: 70px;}
  .product .head h4{margin-top:5px;}
  .product .head *{margin: 0;color:var(--bg-color));font-size: 14px;font-weight:600;}
  .product .detail{padding: 0 15px;border-radius: var(--radius);background-color: var(--bg-card-color);}
  .product .detail p{margin: 0;padding: 15px 0;}
  .product .detail div{border-bottom: solid 1px rgba(0 0 0 / 7%);display: flex;align-items: center;width: 100%;}
  .product .detail *{font-size:14px;}
  .product .detail>div>*{width: 100%;}
  .product .detail span{text-align: right;color:var(--text-white);}
  .product .detail div:last-child{border:none;}
  .product form{padding:0;}
  .product form section{width: 100%;}
  .product form section>div{width: 100%;display:flex;align-items:center;border-bottom: solid 1px rgba(0 0 0 / 7%);padding: 10px ; }
  .product form section>div label{min-width:160px;padding:0;}
  .product form section>div input{border:none;padding:10px ;background-color:rgba(0 0 0 / 3%);border:none;}
  .product form .result{padding: 15px;text-align: right;width: 100%;display: block;color:var(--text-white);font-size:14px;}
  .product .message{ font-size:14px;color:var(--text-white);}
  @media (max-width:960px) {
    .product form section{display: block;} 
    .product form section div:last-child{margin:0;}
  }
    `}</style>
            </>
        )
    }
} 