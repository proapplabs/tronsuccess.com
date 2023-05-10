import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, convertDate, getPrice } from '@utils/func'
import Loading from '../../loading';
import useTranslation from 'next-translate/useTranslation'

export default function TeamItems() {
    const { t, lang } = useTranslation('common');
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/team', fetcher, swrOptions('now'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data) {
        return (
            <>
                <table className="teamItems">
                    <thead>
                        <tr>
                            <th align='left'>{t("date")}</th>
                            <th align='right'>{t("amount")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.length ? (
                            data.items?.map((v, i) => {
                                return (
                                    <tr className="item" key={i}>
                                        <td>{convertDate(v.created_at).date}  - {convertDate(v.created_at).time}</td>
                                        <td align='right' className='amount'>{getPrice(v.amount_total)}TRX</td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr className='empty'><td colSpan={4}> </td></tr>
                        )}
                    </tbody>
                </table>
                <style jsx>{` 
.teamItems{width:calc(100% + 30px);margin :15px -15px 0 -15px;border-collapse: collapse;}
.teamItems .empty{text-align:center;}
.teamItems {border-radius:var(--radius);overflow:hidden;}
.teamItems thead tr{}
.teamItems thead tr th{background:var(--team-table-title-bg); color:var(--team-table-title-text);font-size:14px;padding:10px;font-weight:normal;border-bottom:solid 1px var(--team-table-border);}
.teamItems tbody tr{ background-color: var(--bg-card-color);} 
.teamItems tbody tr td{padding:15px;font-size:14px;border-bottom:solid 1px var(--team-table-border);background:var(--team-table-row-bg);}
.teamItems tbody tr td.amount{color:var(--text-color)}

    `}</style>
            </>
        )
    }
}

{/*    <section className="teamItems">
                    <div className="title">
                        <span>Date</span>
                        <span>Time</span>
                        <span>Level</span>
                        <span>Amount</span>
                    </div>
                    {data.items.map((v, i) => {
                        return (
                            <div className="item" key={i}>
                                <span>{convertDate(v.created_at).date}</span>
                                <span>{convertDate(v.created_at).time}</span>
                                <span>{v.level}</span>
                                <span>{v.amount} TRX</span>
                            </div>
                        )
                    })}
                </section>
          
.teamItems{margin-top: 30px;}
.teamItems>div{display: flex;}
.teamItems>div span{width: 100%;padding: 15px;text-align: right;}
.teamItems>div span:first-child{text-align: left;} 
.teamItems>div.item{background-color: var(--bg-card-color);margin-bottom: 2px;border-radius:5px;margin-bottom:1px;}  
.teamItems>div.item:hover{background-color: white;color:var(--bg-color)}
@media (max-width:960px) {
    .teamItems{}
    .teamItems span{font-size:14px;}
  }
 
 */}