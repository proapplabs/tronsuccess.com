import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, convertDate } from '@utils/func'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Loading from '../loading';
import IconEmpty from '../iconEmpty'
export default function NotificationsItems({ action, table }) {
    const [view, setView] = useState(false)
    const router = useRouter();
    const { id } = router.query
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    let link = null
    if (table == "user") {
        link = '/api/data/notifications'
    } else {
        link = '/api/datas'
    }
    const { data, error } = useSWR(link, fetcher, swrOptions('datas'));
    useEffect(() => {
        if (view == false) {
            setView(true);
        }
    })
    if (error) return null
    if (!data) return null
    return Result(data)

    function Result(data = null) {
        return (
            <>
                <section className="notificationsLists">
                    {data.notifications.length ? (
                        data.notifications?.map((v, i) => {
                            if (v.hidden_detail) {
                                if (action == 'detail') {
                                    if (v.id == id) {
                                        return (
                                            <div key={i} className="detail">
                                                <h2>{v.title}</h2>
                                                <span className="datetime">
                                                    <small>
                                                        {v.date ? (
                                                            v.date + ' ' + v.time
                                                        ) : (
                                                            convertDate(v.created_at).date + ' ' + convertDate(v.created_at).time
                                                        )}
                                                    </small>
                                                </span>
                                                <div dangerouslySetInnerHTML={{ __html: v.content }} className="text"></div>

                                            </div>
                                        )
                                    }
                                } else {
                                    return (
                                        <div key={i}>
                                            <Link href={"/notifications/" + table + "/" + v.id}>
                                                <a>
                                                    <img src="/img/icon/notification.png" width={21} height={21} />
                                                    <div className='body'>
                                                        <h3>{v.title}</h3>
                                                        <span className="datetime">
                                                            <small>
                                                                {v.date ? (
                                                                    v.date + ' ' + v.time
                                                                ) : (
                                                                    convertDate(v.created_at).date + ' ' + convertDate(v.created_at).time
                                                                )}
                                                            </small>
                                                        </span>
                                                    </div>
                                                </a>
                                            </Link>
                                        </div>
                                    )
                                }
                            }
                        })
                    ) : (
                        <IconEmpty title="No notification" content="You can follow the notifications of your transactions on the system here." />
                    )}
                </section>
                <style jsx>{`
.notificationsLists {}
.notificationsLists>div{padding: 15px;background-color: var(--bg-card-color);border-radius: var(--radius);margin-bottom:10px;cursor:pointer;cursor:pointer;}
.notificationsLists h2{font-size:22px;margin:0;font-weight:bold;}
.notificationsLists h3{font-size:14px;margin:0;font-weight:normal;}
.notificationsLists div{font-size:16px; position:relative;}
.notificationsLists div a{display:flex;width:100%;align-items:center;}
.notificationsLists div a img{margin-right:15px;}
.notificationsLists div .datetime{display:block;opacity:0.5; } 
.notificationsLists div.detail {padding:30px;}
.notificationsLists div.detail .text{padding-top:30px;word-wrap: break-word;font-size:14px;}
.notificationsLists div h4{font-size:18px ;margin:0;font-weight:normal;color:yellow;}
.notificationsLists div .list{position:absolute;right:15px;margin:auto;font-size:14px;}
.notificationsLists div .back{width:100%;text-align:center;border-radius:var(--radius);}
   
    `}</style>
            </>
        )
    }
} 