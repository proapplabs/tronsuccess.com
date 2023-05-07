import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, getPrice, convertDate } from '@utils/func'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Loading from '../../loading';
import { security } from '@utils/crypt';
export default function ProfitDetail() {
    const router = useRouter();
    const { id } = router.query
    const ID = id
    // const ID = security(id, false)
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/profit/detail?id=' + ID, fetcher, swrOptions('balances'))
    if (error) return null
    if (!data) return null
    return Result(data)

    function Result(data = null) {
        return (
            <section className='profitDetail'>
                <table>
                    <tbody>
                        <tr>
                            <td>Wallet Address</td>
                            <td> {data.address}</td>
                        </tr>
                        <tr>
                            <td>Account </td>
                            <td className='capitalize'> {data.action}</td>
                        </tr>
                        <tr>
                            <td>Amount </td>
                            <td className='capitalize'> {data.amount} TRX</td>
                        </tr>
                        <tr>
                            <td>Date</td>
                            <td> {convertDate(data.created_at).date}</td>
                        </tr>
                        <tr>
                            <td>Time</td>
                            <td> {convertDate(data.created_at).time}</td>
                        </tr>
                        <tr>
                            <td>Status</td>
                            <td> {data.status ? 'Success' : 'Waiting'}</td>
                        </tr>
                    </tbody>
                </table>
                <style jsx>{`
.profitDetail{padding:0 ;border-radius:var(--radius);background-color:var(--bg-card-color);}
.profitDetail table{width:100%;}
.profitDetail table td{padding:15px;border-top:1px solid var(--bg-color);} 
.profitDetail table tr:first-child td{border:none;}
.profitDetail .capitalize{text-transform:capitalize;}
        `}</style>
            </section>
        )
    }
}