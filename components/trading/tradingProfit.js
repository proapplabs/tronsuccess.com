import { alert } from '@utils/alert';
import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { getPrice, priceTrx, swrOptions } from '@utils/func'
import Loading from '../loading';
import axios from 'axios';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation'
import Logo from "@components/animate";
export default function TradingProfit() {
    const { t, lang } = useTranslation('common');
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/tradings', fetcher, swrOptions('now'))
    const [submitAction, setSubmitAction] = useState(false)
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data = null) {
        const receive = (amount) => {
            const obj = {
                amount
            }
            setSubmitAction(true)
            axios.post(
                "/api/trading",
                obj
            ).then(function (response) {
                if (response.data.error) {
                    setSubmitAction(false)
                    alert('error', 'Error', response.data.error)
                } else {
                    setSubmitAction(false)
                    ///alert('success', 'Success', response.data.data)
                    // alert("success", "Success", "Your earnings have been transferred to your account.");
                }
            }).catch(function (error) {
                setSubmitAction(false)
                alert('error', 'Error', t("alert-500"))
            });
        }
        /*
        // Date fonksiyonu  aa/gg/yyyy formatında zamanı almaktadır.
        var tarih1 = new Date("9/14/2018");
        var tarih2 = new Date("11/21/2018");
        //iki tarih arasındaki saat farkını hesaplamak için aşağıdaki yöntemi kullanabiliriz.
        var zamanFark = Math.abs(tarih2.getTime() - tarih1.getTime());

        //zamanFark değişkeni ile elde edilen saati güne çevirmek için aşağıdaki yöntem kullanılabilir.
        var gunFark = Math.ceil(zamanFark / (1000 * 3600 * 24));

        window.alert(gunFark);
        */




        // const rows = () => {
        //     var now = new Date();
        //     var daysOfYear = [];
        //     return for (var d = new Date(2012, 0, 1); d <= now; d.setDate(d.getDate() + 1)) {
        //         return (<>sdf</>)
        //     }
        // }


        return (
            <>
                <section className="tradingProfit animate__animated animate__fadeInUp">
                    <div className="head">
                        <div>
                            <h4> {t("trading-profit")}</h4>
                            <p>({t("24-hour-settlement")})</p>
                        </div>
                        <div>
                            <Link href="#">
                                <a className=''>View All <i className='fa fa-chevron-right'></i></a>
                            </Link>
                        </div>
                    </div>
                    {data.user.basic_total >= 0 ? (
                        <ul>
                            {data.tradings.map((v, i) => {
                                return (
                                    <li key={i}>
                                        <img
                                            src="/img/icon/trading.jpeg"
                                            alt=""
                                        />
                                        <div className="body">
                                            <div className='text'>
                                                <h6>{priceTrx(v.amount, false)} <span>TRX</span></h6>
                                                <p>{t("quantifying-transaction-revenue")}</p>
                                            </div>
                                            <div className='btnBox'>
                                                {v.status ? (
                                                    <button
                                                        className="btn-gradient active"
                                                    >
                                                        {t("received")}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={(e) => receive(v.amount)}
                                                        className="btn-gradient" >
                                                        {t("receive")}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                )
                            })}

                        </ul>
                    ) : (
                        <div className='  info horizontal'>
                            <p>Add balance to make your account active and start earning.</p>
                            <Link href="/invest/recharge">
                                <a className='btn btn-gradient'>Add Balance</a>
                            </Link>
                        </div>
                    )
                    }

                </section>
                <style jsx>{`
 
.tradingProfit {padding: 30px 0;position: relative;}
.tradingProfit *{margin: 0;border:none;}
.tradingProfit .head{position: relative;margin-bottom: 15px;display:flex; }
.tradingProfit .head h4 {color: var(--text-color);font-size: 20px;font-weight: 700; }
.tradingProfit .head p {color: var(--text-white);font-size: 14px; }
.tradingProfit .head a{font-size: 13px;line-height: 52px;display: inline-block; position: absolute;right: 0;top:0;}
.tradingProfit .head a i{display:inline-block;}
.tradingProfit .head .stats{display:flex;width:100%;text-align:center;gap:15px;margin-top:15px;}
.tradingProfit .head .stats div{width:100%;padding:15px;background-color:var(--bg-card-color);border-radius:var(--radius);}
.tradingProfit ul,
.tradingProfit ul li{list-style: none;margin: 0;padding: 0;}
.tradingProfit ul li{transition: ease all 0.5s;background-color: var(--bg-card-color);padding: 15px;border-radius: var(--radius);display: flex;align-items:center;margin-bottom: 3px;}
 .tradingProfit ul li img{height: 44px;width: 44px;border-radius: var(--radius);}
.tradingProfit ul li .body{margin:0 0 0 15px;position: relative;width: 100% ; display:flex;align-items:center;}
.tradingProfit ul li .body .text {width:100%;}
.tradingProfit ul li .body .text h6{font-size:14px;color:var(--text-color);}
.tradingProfit ul li .body .text h6 span{font-size: 12px;color:var(--text-white);}
.tradingProfit ul li .body .text p{font-size:9px;color: var(--text-white);opacity:0.5}
.tradingProfit ul li .body .btn-box{ width:87px !important;}
.tradingProfit ul li .body .btn-gradient{ filter: none;border:none;font-weight:normal;font-size:14px;}
.tradingProfit ul li .body .btn-gradient.active{filter:grayscale(1)}
.tradingProfit ul li .body button{border-radius:100px;padding:5px 20px;font-size:12px !important;}
.tradingProfit ul li.active a{opacity: 0.4;}
.tradingProfit .info p{margin-bottom:15px;}
@media (max-width:960px) {
    .tradingProfit{padding-top:15px;}
    .tradingProfit .head h4 {font-size:18px;margin:0;}
    .tradingProfit .head a{font-size: 16px;}
    .tradingProfit ul li div a.btn-color{position: inherit;margin-top: 15px;font-size: 12px;}
    .tradingProfit ul li img{height: 40px;width: auto;}
    .tradingProfit ul li .body .btn-color{ position:inherit;padding:7px 15px; font-size:12px ;}
    .tradingProfit ul li .body .text h6{font-size:16px;}
    .tradingProfit ul li .body .text p{font-size:12px;}
}
`}</style>
            </>
        )
    }
} 