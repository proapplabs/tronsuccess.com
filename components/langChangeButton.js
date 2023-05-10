
import { alert, alertScam } from '@utils/alert';
import Link from 'next/link';

import useTranslation from "next-translate/useTranslation";
import i18nConfig from "../i18n.json";
import { useRouter } from "next/router";
import { capitalize } from '@utils/func';
const { locales, defaultLocale } = i18nConfig;

export default function LangChangeButton() {
    const { locale, asPath } = useRouter()
    const { t, lang } = useTranslation('common')
    return (
        <>
            <span className='lang'  >
                <a className='langButton'>
                    {lang}
                </a>
                <section>
                    <div>
                        <div>
                            {locales.map((l, i) => {
                                if (l === lang) {
                                    return (
                                        <Link href={asPath} locale={l} key={l} >
                                            <a className={l == lang ? 'active   link' : 'link'}>
                                                {capitalize(t(`language-name-${l}`))}
                                            </a>
                                        </Link>
                                    );
                                }
                            })}
                            {locales.map((l, i) => {
                                if (l === lang) return null;
                                return (
                                    <Link href={asPath} locale={l} key={l} >
                                        <a className={l == lang ? 'active   link' : 'link'}>
                                            {t(`language-name-${l}`)}
                                        </a>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </span>

            <style jsx  >{`
            section{display:none;padding-top:30px;position:absolute;top:0; right:0;background-color:rgba(0 0 0 /  0%);z-index:99999999999;width:auto; margin:auto;} 
            section>div>div{max-height:70vh;overflowh:auto;background-color:#012342;color:var(--text-white);padding:10px;border-radius:var(--radius); position:relative; overflow:auto; }
            section>div>div .link{cursor:pointer;min-width:180px;border-radius:var(--radius);color:var(--white);display:block;text-align:center;padding:10px;background-color:#001e3a;margin-bottom:10px;font-size:12px;min-height:32px; } 
            section>div>div .link.active{color:var(--white); }

            span{margin-left:10px;position:relative;}
            span:hover section{display:block;}  
            span .langButton{border:solid 2px var(--text-color);border-radius:5px;display:inline-block;padding: 3px  4px;font-weight:bold;color:var(--text-color);margin-bottom:5px;position:relative;top:-6px;text-transform:uppercase;font-size:10px;box-sizing:border-box;}         
@media (max-width:960px) {
 
            }
            `}</style>
        </>
    )
}  