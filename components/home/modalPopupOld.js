import useSWR from 'swr'
import { swrOptions } from '@utils/func'
import Loading from '../loading'
import axios from 'axios';
import { useRouter } from "next/router";
import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation'
export default function ModalPopup({ status }) {
    const { t, lang } = useTranslation('common');
    const router = useRouter()
    const [view, setView] = useState(status)
    const closed = () => {
        axios.post(
            '/api/popup-modal',
            { read: true }
        ).then(function (response) {
            //router.reload(window.location.pathname);
            setView(response.data.status)

        }).catch(function (error) {
            // alert('error', 'Error', 'An unexpected error has occurred.')
        });
    }

    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data = null) {

        if (view) {
            return (<></>)
        }
        return (
            <>
                <section>
                    <div>
                        <div>
                            <div className="header">
                                {data.notifications?.map((v, i) => {
                                    if (v.modal) {
                                        return (
                                            <h3 key={i}  >{v.title}</h3>
                                        )
                                    }
                                })}
                                <img src="/img/icon/close.png" onClick={() => closed()} />
                            </div>
                            <div className="body">
                                {data.notifications?.map((v, i) => {
                                    if (v.modal) {
                                        return (

                                            <div dangerouslySetInnerHTML={{ __html: v.content }} style={{ color: "var(--modal-color-text)" }} key={i} />

                                        )
                                    }
                                })}
                            </div>
                            <div className="footer">
                                <button onClick={() => closed()}>
                                    <img src="/img/icon/arrow-left.png" /> {t("previous")}
                                </button>
                                <button onClick={() => closed()}>
                                    {t("next")}
                                    <img src="/img/icon/arrow-right.png" />
                                </button>
                            </div>
                        </div>
                        <span className='bgclose' onClick={() => closed()}></span>
                    </div>
                </section>
                <style jsx>{`
section{position:fixed;top:0;bottom:0;left:0;right:0;background-color:rgba(0 0 0 / 50%);z-index:999999999;  max-width: 680px;margin: 0 auto;}
section>div{display:flex;justify-content:center;aling-items:center;height:100%;}
section>div>div{background-color:var(--modal-color-body);width:335px;height:auto;margin:auto;border-radius:15px 15px 0 0;overflow:hidden;position:relative;z-index:999;}
section>div>div *{color:var(--modal-color-text);}
section>div>div>.header{position:relative;}
section>div>div>.header h3{margin:0;padding:15px;font-size:15px;font-weight:700;    background: var(--gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;}
section>div>div>.header img{width:20px;hieght:20px;position:absolute;right:15px;top:15px;}
section>div>div>.body{height:250px;overflow:auto;padding:15px; background-color:rgba(0 0 0 /  10%);font-size:13px;}
section>div>div>.footer{display:flex;padding:10px;gap:3px;background-color:rgba(0 0 0 / 25%);}
section>div>div>.footer button{cursor:pointer;background:var(  --modal-color-button-bg); border:none;align-items:center;display:flex;text-decoration:none;width:100%;text-align:center;color:var(--modal-color-button-text);width:100%;justify-content:center;padding:10px 0;font-weight:700;}
section>div>div>.footer button img{width:8px;height:14px;margin:0 5px; filter:brightness(0) invert(1); }
section .bgclose{position:fixed; left:0;right:0;bottom:0;left:0;width:100%;height:100%;z-index:9;}
   @media (max-width:960px) {
    section{     max-width: 100%;margin: 0; } 
   }
           `}</style>
            </>
        );
    }
}