import Link from "next/link"
import LangChangeButton from "./langChangeButton";
import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { phoneHidden } from '@utils/func'
import { useRouter } from "next/router";
import Loading from '@components/loading'
import { swrOptions, changeLanguage } from '@utils/func'
import useTranslation from 'next-translate/useTranslation'
export default function NavigationTop() {
    const { t, lang } = useTranslation('common')
    // const [show, setShow] = useState(true)
    const router = useRouter()
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas?lang=' + lang, fetcher, swrOptions('datas'))
    if (error) return Loading()
    if (!data) return Loading()
    return Result(data)

    // if (!data.account) {
    //     router.push("/logout")
    // } else {
    //     return Result(data)
    // }
    // if (data.user_status == false) {
    //     router.push("/logout")
    // }
    function Result(data) {
        const page = router.pathname.split('/')
        let show = true
        let phone = null
        if (
            page[1] == 'notifications' ||
            page[1] == 'mine' && page[2] == 'team' ||
            page[1] == 'mine' && page[2] == 'change' ||
            page[1] == 'mine' && page[2] == 'transfer' ||
            page[1] == 'mine' && page[2] == 'withdrawal' ||
            page[1] == 'mine' && page[2] == 'profit'
        ) {
            show = false
        }
        if (page[1] == 'mine') {
            phone = <Link href="/"><a className="logoPhone gradient-text">{phoneHidden(data.account.user.phone)}</a></Link>
        }
        return (
            <>
                {show ? (
                    <section className="navigationTop animate__animated animate__fadeInDown">
                        <div className="container">
                            {data.login ? (
                                <div className="phone">{phone}</div>
                            ) : (
                                <Link href="/">
                                    <a className="logoButton">Sign up </a>
                                </Link>
                            )}
                            <div className="buttons">
                                {data.login ? (
                                    <Link href="/notifications">
                                        <a className="notify"><img src="/img/icon/notification.png" alt="" />
                                            <i className="point" /></a>
                                    </Link>
                                ) : ""}
                                {data.telegram ? (
                                    <Link href={data.telegram.support} >
                                        <a target="_blank"><img src="/img/icon/telegram.png" alt="" /></a>
                                    </Link>
                                ) : null}
                                <LangChangeButton />
                            </div>
                        </div>
                    </section>
                ) : (
                    ' '
                )}

                <style jsx global>{`
            .navigationTop{padding:15px 0;  }
            .navigationTop .container{padding:  0;  }
            .navigationTop .phone{font-weight:bold;font-size:20px;line-height:30px;display:inline-block;color:var(--text-color);}
            .navigationTop:after{content: ' ';display: block;clear: both;}
            .navigationTop .logo{display: inline-block;font-size:30px;font-weight: bold;height: 21px; }
            .navigationTop .buttons{float:right;display: inline-block;}
            .navigationTop .buttons img{height: 21px;}
            .navigationTop .buttons .notify{position:relative;}
            .navigationTop .buttons .notify i{background-color:#ff623b; width:6px;height:6px;position:absolute;top:0;right:-2px;border-radius:100%;}
            .navigationTop .buttons>a{display: inline-block;margin-left: 10px;color:white ;}
            @media (max-width:960px) {
                .navigationTop .logo{height: 20px;}
                .navigationTop .phone{font-size:16px;line-height:21px;}
                .navigationTop .buttons img{height: 21px;}
            }
            `}</style>
            </>
        )
    }
}
