import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions } from '@utils/func'
import Loading from '../loading';
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link';
export default function InvestProducts() {
    const { t, lang } = useTranslation('common');

    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/invest/products', fetcher, swrOptions('products'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data = null) {
        return (
            <>
                <section className="investProducts">
                    <div className="items">
                        {data.items ? (
                            data.items.map((v, i) => {
                                return (
                                    <Link href={"/invest/products/" + v.id} key={i}>
                                        <a>
                                            <img src={v.image} alt="" />
                                            <div className="text">
                                                <div>
                                                    <h6> {v.title.en}</h6>
                                                    <p> {t("daily-rate")} : {v.rate}%   </p>
                                                    <p> {t("cycle")} : {v.crcle} {t("day")} </p>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                )
                            })
                        ) : (
                            <div className='empty'>
                                <p>{t("no-products")}</p>
                            </div>
                        )}
                    </div>
                </section>
                <style jsx>{`
.investProducts .empty{padding:30px;text-align:center;width:100%;} 
.investProducts .items{display: flex; gap: 30px;flex-wrap: wrap;margin-top: 30px;}
.investProducts .items a{display: block;width: calc(50% - 15px);position: relative;overflow: hidden;border-radius: var(--radius);align-items:center;background-color:var(--bg-card-color);}
.investProducts .items a *{margin: 0;}
.investProducts .items a img{border-radius: var(--radius);width: 100%;display: block;transition: ease all 0.5s;z-index: 1;} 
.investProducts .items a h6{font-size:14px;color:var(--text-color);font-weight:normal;}
.investProducts .items a p{font-size:14px;color:var(--text-white);margin-top:5px;} 
.investProducts .items a .text{   }
.investProducts .items a .text div{ padding:15px   ;}
.investProducts .items a .text div i{display:none;}
.investProducts .items a .text div p{font-size:12px;}
.investProducts .items a .text *{width: 100%;} 
@media (max-width:960px) {
   .investProducts .items{gap:15px;}
   .investProducts .items a{ width: calc(50% - 8px);  } 
   .investProducts .items a img{  margin:15px;width:calc(100% - 30px);} 
}
    `}</style>
            </>
        )
    }
} 