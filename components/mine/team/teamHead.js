import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions, getPrice } from '@utils/func'
import Loading from '../../loading';
import useTranslation from 'next-translate/useTranslation'

export default function TeamHead() {
    const { t, lang } = useTranslation('common');
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/data/team', fetcher, swrOptions('team'))
    if (error) return null
    if (!data) return null
    return Result(data)
    function title(title) {
        switch (title) {
            case "Level 1": return t("level-1"); break;
            case "Level 2": return t("level-2"); break;
            case "Level 3": return t("level-3"); break;
            default:
                return title;
        }
    }
    function Result(data = null) {
        return (
            <>
                <section className="teamHead">
                    <div className='levels'>

                        {data.levels.map((v, i) => {
                            return (
                                <div key={i}>
                                    <h4>  {title(v.title)} </h4>
                                    <p>{v.total_user} </p>
                                </div>
                            )
                        })}

                    </div>
                </section>
                <style jsx>{`
.teamHead{font-size:16px;border-radius:var(--radius)} 
.teamHead *{margin:0;padding:0;} 
.teamHead h4{text-align:center;}
.teamHead .levels{display:flex;gap:15px;border-radius:var(--radius);color:var(--team-counter-title-text);} 
.teamHead .levels div{background-color:var(--team-counter-bg); border-radius:var(--radius);text-align:center;width:100%;} 
.teamHead .levels h4{font-size:14px; border-radius:var(--radius);color:var(--team-counter-title-text);line-height:36px;font-weight:normal;background:var(--team-counter-title-bg);}
.teamHead .levels p{font-size:16px; color:var(  --team-counter-total-text);line-height:60px;}  
@media (max-width:960px) {
 
  }
    `}</style>
            </>
        )
    }
}

// U2FsdGVkX1882bpzMHyiGcQJYpK42DScvo9LuudpeNA=