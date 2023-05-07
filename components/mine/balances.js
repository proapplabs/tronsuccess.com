import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, priceTrx } from '@utils/func'
import Loading from '../loading';
import useTranslation from 'next-translate/useTranslation'

export default function Balances({ page = "profile" }) {
    const { t, lang } = useTranslation('common');
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('balances'))
    if (error) return null
    if (!data) return null
    return Result(data)

    function Result(data = null) {
        return (
            <>
                <div className={'info warning quantity'}>
                    <div>
                        <p>{t("trx-deposit-quantity")}</p>
                        <h3 className='price'>
                            {!data.account.user.balance ? (<>0.00   / 0.00 TRX</>) : (<>{priceTrx(data.account.user.balance.basic.total) + '  / ' + priceTrx(data.account.user.balance.promotion.total)}  </>)}
                        </h3>
                        <p>{t("balances-content")}</p>
                    </div>
                </div>

                <style jsx>{` 
.info{margin-bottom:30px;background:var(--balance-bg) !important;}
.info>div{padding:0;width:100%;} 
.quantity *{margin:0;color:var(--text-white);}
.quantity p{font-size:12px;}
.quantity .price{font-size:16px;color:var(--text-color);margin:5px 0;} 
@media (max-width:960px) {
.info .price{font-size:15px ;}
.info p{font-size:12px ;}
}
`}</style>
            </>
        )
    }
} 