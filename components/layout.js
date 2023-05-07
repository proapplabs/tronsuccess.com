
import { useRouter } from "next/router";
import NavigationTop from '@components/navigationTop'
import NavigationBottom from '@components/navigationBottom'
import useTranslation from 'next-translate/useTranslation'
import { swrOptions, changeLanguage } from '@utils/func'
import { alertScam } from '@utils/alert'
import useSWR from 'swr'
import Loading from './loading'
import Link from 'next/link'
export default function layout({ children }) {
    const router = useRouter()
    const { t, lang } = useTranslation('common')
    const isRTL = lang === 'ar' || lang === 'he'
    const arrow = isRTL ? String.fromCharCode(8592) : String.fromCharCode(8594)



    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas?lang=' + lang, fetcher, swrOptions('datas'))

    if (error) return Loading()
    if (!data) return Loading()
    return Result(data);



    function Result(data) {
        if (data.user_status == false) {
            router.push("/logout")
        }
        //dir={isRTL ? 'rtl' : 'ltr'}
        return (
            <main className='container ' >
                {data.scam ? (
                    <div style={{
                        backgroundImage: "url(/img/bg/ban.gif)",
                        height: "100vh",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "auto 60%"

                    }}>
                        <Link href={data.telegram.support}  >
                            <a style={{
                                backgroundColor: "var(--btn-bg-color)",
                                color: "var(--btn-text-color)",
                                position: "fixed",
                                bottom: 30,
                                left: 0,
                                right: 0,
                                display: "inline-block",
                                width: 200,
                                zIndex: 99999999,
                                padding: 15,
                                borderRadius: 100,
                                textAlign: "center",
                                margin: "auto"
                            }} target="_blank">Go Support Channel</a>
                        </Link>
                    </div>

                ) : (
                    <>
                        <NavigationTop />
                        <div className=' '>
                            {children}
                        </div>
                        <NavigationBottom />
                    </>
                )
                }

            </main >
        )
    }
}