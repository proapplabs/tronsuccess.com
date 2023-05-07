import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions } from '@utils/func'
import Link from 'next/link'
import Loading from '../loading';
export default function AppDownloads() {
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/apps', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data)

    function Result(data = null) {
        return (
            <>
                <section className="apps">
                    {data.apps.map((v, i) => {
                        return (
                            <div className="box" key={i}>
                                <div className='text'>
                                    <h1>{v.title}</h1>
                                    <p>{v.content}</p>
                                </div>
                                {v.app ? (
                                    <div className='downloadButtons'>
                                        <>
                                            <img src={v.qr} className='qr' width="100%" />
                                            <Link href={v.app}>
                                                <a className='download'><img src={'/img/download-' + v.button + '.svg'} width="100%" /></a>
                                            </Link>
                                        </>
                                    </div>
                                ) : (
                                    <div className='downloadButtons'>
                                        <>
                                            <div className='coomingSoon'>
                                                <i className='fa fa-frown-o  fa-2x'></i>
                                                <p>Cooming Soon</p>
                                            </div>
                                        </>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </section>
                <style jsx>{`
 
.apps{display:flex; text-align:center; gap:60px;  justify-content: center; }
.apps>div{max-width:30%;}
.apps .text h1{margin:0;font-size:20px;}
.apps .text p{margin:auto auto 30px auto;}
.apps img{width:100%;height:auto;}
.apps .coomingSoon{padding:15px;background-color:var(--bg-card-color);border-radius:var(--radius);text-align:center;}
.apps .download{margin:auto;} 
.apps img{width:100%;}
.apps .qr{border-radius:var(--radius);width:100%;margin: auto auto 15px auto;}
@media (max-width:960px) {
    .apps{gap:30px;}
    .apps>div{max-width:40%;}
    .apps p{font-size:12px;}
    }
    `}</style>
            </>
        )
    }
} 