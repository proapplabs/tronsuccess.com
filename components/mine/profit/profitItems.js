import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, convertDate, capitalize } from '@utils/func'
import Loading from '../../loading';
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from "next/router";
export default function ProfilItems() {
    const { t, lang } = useTranslation('common');
    const router = useRouter()
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/profit/list', fetcher, swrOptions('profit'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data) {
        const detail = (v) => {
            router.push("/mine/profit/" + v.id)
        }
        return (
            <section className='profitItems'>
                <table>
                    <thead>
                        <tr>
                            <th align='left'>{t("date")}</th>
                            <th align='right'>{t("amount")}</th>
                        </tr>
                    </thead>
                    {!data.items.length ? (
                        <tbody>
                            <tr>
                                <td colSpan="5" className='tableEmpty'></td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            {data.items?.map((v, i) => {
                                return (
                                    <tr key={i}  >
                                        <td>{convertDate(v.created_at).date}</td>
                                        <td align='right'>{v.amount}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    )}
                </table>
                <style jsx>{` 
.profitItems{padding-top:30px; }
.profitItems table{width:100%;border-collapse: collapse;border-radius:15px 15px 0 0;overflow:hidden;background-color:var(--bg-text);}
.profitItems tr th{padding:10px;font-size:14px;font-weight:normal}
.profitItems tr td{padding:15px 10px;font-size:12px;} 
.profitItems thead tr th{background-color:var(--team-table-title-bg); color:var( --team-table-title-text); font-size:14px;padding:10px;font-weight:normal;}
.profitItems tbody tr{ background-color: var(--bg-card-color);} 
.profitItems tbody tr td{padding:15px;font-size:14px;border-bottom:solid 1px rgba(255 255 255 / 10%);background:var(--team-table-row-bg);}
.profitItems tbody tr td.amount{color:var(--text-color)}
    `}</style>
            </section>
        )
    }
}