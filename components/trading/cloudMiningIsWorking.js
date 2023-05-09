import { swrOptions } from '@utils/func'
import { useEffect, useState } from 'react';
import useSWR from 'swr'
import Loading from '../loading';
import useTranslation from 'next-translate/useTranslation'
import Logo from "@components/animate";
export default function CloudMiningIsWorking() {
    const { t, lang } = useTranslation('common');
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function Result(data = null) {
        return (<>
            <section className="CloudMiningIsWorking animate__animated animate__fadeIn">
                <div>
                    <h6>+{data.miningRate}%</h6>
                    <p>{t("cloud-mining-is-working")}</p>
                </div>
            </section>
            <style jsx>{`
.CloudMiningIsWorking {position:relative;overflow:Hidden;background-image:  var(--bg-card-color); padding: 30px 0px;text-align: left;border-radius: var(--radius);
background-image:url(/img/bg/trading.png);background-size:100% !important;background-position:center;position:relative;
display:block;justify-content:space-between ;align-items:center;
}
.CloudMiningIsWorking * {margin: 0;color: white;padding:0;}
.CloudMiningIsWorking div{padding-left:30px;text-align: center;}
.CloudMiningIsWorking h6 {font-size: 30px;font-weight: 700;margin-bottom: 10px;color:var(--text-color);}
.CloudMiningIsWorking p {font-size: 20px;font-weight:bold;color:var(--text-color); } 
.CloudMiningIsWorking img{position:absolute;right:30px;top:0;bottom:0;margin:auto;}
 
@media (max-width:960px) { 
.CloudMiningIsWorking h6{margin:0;font-size:20px;}
.CloudMiningIsWorking p{font-size:14px;}
.CloudMiningIsWorking span{ font-size:12px;}

} 
`}</style>
        </>)
    }
}