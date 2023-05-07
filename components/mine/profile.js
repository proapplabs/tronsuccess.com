import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, convertDate, phoneHidden } from '@utils/func'
import Loading from '../loading';
import Link from 'next/link';
export default function Profile() {
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data)

    function Result(data = null) {
        const lastLogin = () => {
            if (!data.account.user.last_login) {
                return (<p>Last login: - </p>)
            } else {
                const lastLogin = data.account.user.last_login
                const lastLoginCreated = convertDate(lastLogin.created_at)
                return (<span>Last login: {lastLoginCreated.date + ' ' + lastLoginCreated.time} </span>)
            }

        }

        return (
            <>
                <section className="profile">
                    <div className='avatar'>

                    </div>
                    <div className='body'>
                        <div>
                            <h6>Phone Number</h6>
                            <p>{phoneHidden(data.account.user.phone)}  </p>
                            {lastLogin}
                        </div>
                        <Link href="/logout">
                            <a className='logout' >
                                <i className='fa  fa-power-off '></i>
                            </a>
                        </Link>
                    </div>
                </section>
                <style jsx>{`

.profile {background-color: var(--bg-card-color);padding: 30px;border-radius: var(--radius);margin-bottom:15px;display:flex;border:solid 1px rgba(255 255 255 / 10%);position:relative;}
.profile .avatar{background-color:white;width:50px;height:50px;border-radius:100%;margin-right:30px;display:flex;justify-content:center;align-items:center;font-size:35px;background-image:url('/img/avatar.png');background-size:cover;}
.profile .avatar i{}
.profile * {margin: 0;}
.profile .body div h6 {color: var(--text-color);font-size: 15px;font-weight: normal;}
.profile .body div p {color:white;font-size: 20px;font-weight: 700;}
.profile .body div span{font-size: 12px;display: inline-block; opacity:0.4;}
.profile .body div span i{font-size:16px;}
.profile .logout{position:absolute;right:30px;top:0;bottom:0;height:40px;margin:auto;display:inline-block;text-align:center;}
.profile .logout img{display:block;height:40px;margin-bottom:0;}v
.profile .logout i{font-size:40px;opacity:0.4;}
.profile .logout:hover i{ opacity:1;}
@media (max-width:960px) {
.profile{padding: 15px;}
.profile .body div h6 {font-size:12px;}
.profile .body div p {font-size: 16px;} 
.profile .logout{height:20px;right:20px;}
.profile .logout i{font-size:20px;}
.profile .avatar{width:38px;height:38px;}

}
    `}</style>
            </>
        )
    }
}

