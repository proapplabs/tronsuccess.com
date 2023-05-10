import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, getPrice } from '@utils/func'
import Loading from '../loading';
import useTranslation from 'next-translate/useTranslation'


export default function BalancesCard({ page = "profile" }) {
    const { t, lang } = useTranslation('common');
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('balances'))
    if (error) return null
    if (!data) return null
    return Result(data)

    function Result(data = null) {
        return (
            <>
                <section >
                    <div>
                        <p>{t("basic-income")}</p>
                        <h3 className='price'>
                            {!data.account.user.balance ? (<>0.00 TRX / 0.00 TRX</>) : (<>{data.account.user.balance.basic.total} TRX  </>)}
                        </h3>
                    </div>
                    <div>
                        <p>{t("promotion-income")}</p>
                        <h3>{!data.account.user.balance ? (<>0.00 TRX </>) : (<> {data.account.user.balance.promotion.total} TRX</>)}</h3>
                    </div>
                </section>

                <style jsx>{` 
section{display:flex;width:calc(100% - 30px);gap:30px;margin:0 15px;}
section>div{background:rgba(255 255 255 / 6%);text-align:center;width:100%;border-radius:var(--radius);padding:15px;}
section>div p{font-size:80%;margin:0 0 7px 0;color:#6c757d;}
section>div h3{color:var(--text-color);margin:10px 0 0 0;font-size:15px;font-weight:700;}
@media (max-width:960px) {
 
}
`}</style>
            </>
        )
    }
} 