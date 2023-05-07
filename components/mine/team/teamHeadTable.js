import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions } from '@utils/func'
import Loading from '../../loading';
import useTranslation from 'next-translate/useTranslation'
export default function TeamHeadTable() {
    const { t, lang } = useTranslation('common');
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/team', fetcher, swrOptions('team'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data = null) {
        return (
            <>
                <section className="teamHead">
                    <div className="total">
                        <h4>{data.total.title}</h4>
                        <div>
                            <p>{t("total-aomunt")} <b>{data.total.total_amount} TRX</b></p>
                            <p>{t("total-user")}  <b>{data.total.total_user}</b></p>
                        </div>
                    </div>
                    <table className='levels'>
                        {data.levels.map((v, i) => {
                            return (
                                <tr key={i}>
                                    <td>{v.title}</td>
                                    <td align='center'> {v.total_user} </td>
                                    <td align='right'> {v.total_amount} TRX  </td>
                                </tr>
                            )
                        })}
                    </table>
                </section>
                <style jsx>{`
.teamHead{font-size:16px;border-radius:var(--radius);background-color:var(--bg-card-color);} 
.teamHead *{margin:0;padding:0;}
.teamHead .total{padding:15px;} 
.teamHead h4{text-align:center;margin-bottom:10px;}
.teamHead .levels{ width:100%; border-radius:var(--radius);background-color:white;color:var(--text-white);} 
.teamHead .levels td{padding:7px;font-size:14px;}
 
@media (max-width:960px) {
 
  }
    `}</style>
            </>
        )
    }
}

// U2FsdGVkX1882bpzMHyiGcQJYpK42DScvo9LuudpeNA=