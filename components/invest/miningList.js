import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, convertDateReplace } from '@utils/func'
import Loading from '../loading';
import Link from 'next/link';
import { useRouter } from "next/router";
import Accordion from '../accordion';
export default function MiningList() {
    const router = useRouter()
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/minings', fetcher, swrOptions('profit'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data) {
        return (
            <section className='planItems'>

                {!data.items.length ? (
                    <>
                        <div className='empty  info horizontal'>
                            <div className='body'>
                                <img src='/img/file.png' />
                                <p>There are currently no orders</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        {data.items?.map((v, i) => {
                            return (
                                <Accordion key={i} className="card" title={v.order_number} >
                                    <>
                                        <div className='title' >  {v.plan.title}</div>
                                        <table>
                                            <tbody>
                                                <tr><td>Remaining Day</td><td>{v.remaining.day}</td></tr>
                                                <tr><td>Start / Stop Date</td><td>{convertDateReplace(v.start_date)} / {convertDateReplace(v.stop_date)}</td></tr>
                                                <tr><td>Fee Deposited</td><td>{v.amount} TRX</td></tr>
                                                <tr><td>Fee to be earned</td><td>{v.earning} TRX</td></tr>
                                                <tr><td>Status </td><td>{v.status ? <> Working <i className="fa fa-refresh fa-spin fa-3x fa-fw"></i></> : 'Completed '}</td></tr>
                                            </tbody>
                                        </table>

                                    </>
                                </Accordion>
                            )
                        })}
                    </div>
                )}
                <style jsx>{`
       .planItems .cover{ width:100%;height:130px;background-image:url(/img/mining.gif);background-size: contain ;background-position:  bottom;background-repeat:no-repeat;background-color:#d39a49;border-radius: 5px;}  
       .planItems .cover.stop{background-image:url(/img/mining-stop.png);}
 .planItems table{width:100%; }
 .planItems table td:first-child{text-align:left;}
 .planItems table td:last-child{text-align:right;} 
 .planItems .title{margin-bottom:15px;  padding:5px;}
 
 .planItems span{display:block;font-size:10px;}
 .planItems .date{display:flex;gap:15px;}
 .planItems .date div{padding:5px;width:100%;}
 .planItems .fa{font-size:14px;}
 .planItems td{padding:10px;}

 .empty{background-color:rgba(0 0 0 / 0%) !important;}
 .empty p{color:#6f80b3;margin-top:10px !important;font-size:14px;}

   `}</style>
            </section>
        )
    }
}