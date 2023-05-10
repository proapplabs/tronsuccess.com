import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, getPrice, priceTrx } from '@utils/func'
import Loading from './loading';
import Link from 'next/link';
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
export default function TotalBallance() {
    const { t, lang } = useTranslation('common');
    const router = useRouter()
    const currentArray = router.pathname.split('/')
    const currentPage = currentArray[1]
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data)

    function Result(data = null) {
        return (
            <>
                {currentPage == 'mine' ? (
                    <section className="TotalBalance mine" style={{
                    }}>
                        <h6 style={{ color: "var(--bg-color)" }}>{t("total-balance")}</h6>
                        <p style={{ color: "var(--bg-color)" }}>{priceTrx(data.totalBallance, false)} <span>TRX</span></p>
                    </section>
                ) : (

                    <section className="TotalBalance  " style={{
                        backgroundImage: "url(/img/bg/home.png)"
                    }}>
                        <h6 >{t("total-balance")}</h6>
                        <p>{priceTrx(data.totalBallance, false)} <span>TRX</span></p>
                    </section>
                )}
                {currentPage == 'mine' ? (
                    <section className={'buttons ' + currentPage}>
                        <Link href="/invest/recharge">
                            <a>
                                <img src="/img/icon/button/deposit.png" />
                                <span>{t("deposit")}</span>
                            </a>
                        </Link>
                        <Link href="/mine/withdrawal">
                            <a>
                                <img src="/img/icon/button/withdrawal.png" />
                                <span>{t("withdrawal")}</span>
                            </a>
                        </Link>

                    </section>
                ) : (
                    ''
                )}

                <style jsx>{`
         
.buttons{background-color:var(--bg-card-color);padding:15px; display:flex;justify-content:space-between;border-radius: 0 0  var(--radius) var(--radius);margin-top:- 5px;z-index:99;position:relative;}
.buttons a{display:flex;align-items:center;}
.buttons a img{width:32px;}
.buttons a span{padding-left:15px;font-size:15px;color:var(--text-color);}

.TotalBalance {margin-top:25px;position:relative;overflow:hidden;background:var( --total-balance-bg);padding:30px 15px;text-align: center;border-radius: var(--radius);background-size:cover;  }
.TotalBalance * {margin: 0;padding:0;}
.TotalBalance h6 {color: var( --total-balance-text);font-size: 15px;font-weight: normal;}
.TotalBalance p {color:var( --total-balance-text);font-size: 40px; margin-top:20px;}
.TotalBalance span{font-size: 20px;display: inline-block;margin-right: -40px;}
.TotalBalance.mine{padding:20px 0;}
.TotalBalance.mine h6{color:var(--bg-color) !important;}
.TotalBalance.mine p{color:var(--bg-color) !important;font-weight:600}
 

@media (max-width:960px) {
    .TotalBalance p {font-size:25px;}
    .TotalBalance span {margin-right: 0px;}
    .buttons a span{font-size:12px;}
}
    `}</style>
            </>
        )
    }
}

