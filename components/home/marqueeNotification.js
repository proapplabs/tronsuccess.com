import useSWR from 'swr'
import { swrOptions } from '@utils/func'
import Loading from '../loading'
import Link from 'next/link'
export default function MarqueeNotification() {
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data = null) {
        return (<>
            <section className="MarqueeNotification animate__animated animate__fadeIn">
                <img
                    src="/img/icon/bell.png"
                    alt=""
                />
                <marquee>
                    {data.notifications?.map((v, i) => {
                        if (v.bar) {
                            return (
                                <span key={i}><i> </i> {v.title} </span>
                            )
                        }
                    })}
                </marquee>
            </section>
            <style jsx>{`
                .MarqueeNotification{ margin-top: 30px; padding: 15px; background-color: var(--bg-card-color); border-radius: var(--radius); display: flex; }
                .MarqueeNotification img{height: 20px;}
                .MarqueeNotification marquee{margin-left:15px;}
                .MarqueeNotification span{display:inline-block;font-size:14px;color:var(--marquee-text)}
                .MarqueeNotification span i{padding:0 10px;font-style:normal;}
                @media (max-width:960px) {
                .MarqueeNotification{margin-top: 15px;padding: 15px;}
                .MarqueeNotification img{height: 18px;}
                .MarqueeNotification marquee{height: 18px;}
                .MarqueeNotification marquee span{font-size:12px;}
                }
            `}</style>
        </>)
    }
}