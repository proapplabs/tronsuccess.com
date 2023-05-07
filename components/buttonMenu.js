
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import Link from "next/link"
export default function ButtonMenu({ page = "home" }) {
    const { t, lang } = useTranslation();
    const router = useRouter()
    let links = []
    if (page == "home") {
        links = [
            [
                {
                    icon: "deposit",
                    title: t("common:deposit"),
                    link: "/invest/recharge"
                },
                {
                    icon: "withdrawal",
                    title: t("common:withdrawal"),
                    link: "/mine/withdrawal"
                },
                {
                    icon: "share",
                    title: t("common:share"),
                    link: "/share"
                }
            ],
            [
                {
                    icon: "team",
                    title: t("common:team"),
                    link: "/mine/team"
                },
                {
                    icon: "app",
                    title: t("common:app"),
                    link: "/download/tronsuccess.apk"
                },
                {
                    icon: "logout",
                    title: t("common:logout"),
                    link: "/logout"
                }
            ]
        ];
    } else {
        links = [
            [
                {
                    icon: "team",
                    title: t("common:team"),
                    link: "/mine/team"
                },
                {
                    icon: "profit-list",
                    title: t("common:profit-list"),
                    link: "/mine/profit"
                },
                {
                    icon: "transfer-to-basic",
                    title: t("common:transfer-to-basic"),
                    link: "/mine/transfer"
                },
            ],
            [
                {
                    icon: "share",
                    title: t("common:share"),
                    link: "/share"
                },
                {
                    icon: "notification",
                    title: t("common:notifications"),
                    link: "/notifications"
                },
                {
                    icon: "app",
                    title: t("common:app"),
                    link: "/download/tronsuccess.apk"
                }
            ],
            [
                {
                    icon: "change-password",
                    class: "password",
                    title: t("common:change-password"),
                    link: "/mine/change/password"
                },
                {
                    icon: "change-security-password",
                    class: "password",
                    title: t("common:change-security-password"),
                    link: "/mine/change/security"
                }
            ],
            [
                {
                    // icon: "logout", 
                    class: "logout",
                    title: t("common:logout"),
                    link: "/logout"
                }
            ]
        ];
    }
    // let { mobile } = router.query
    const currentArray = router.pathname.split('/')
    const currentPage = currentArray[1]
    return (<>
        <section className={"buttonMenu " + currentPage}>
            {links.map((g, i) => {
                return (
                    <div className='group' key={i}>
                        {
                            g.map((b, i) => {
                                return (
                                    <Link href={b.link} key={i}>
                                        <a className={b.class ? b.class : null}>
                                            <div>
                                                {b.icon ? <img src={"/img/icon/button/" + b.icon + ".png"} /> : ""}
                                                <span>{b.title}</span>
                                            </div>
                                        </a>
                                    </Link>
                                )
                            })
                        }
                    </div>
                )
            })}
        </section >
        <style jsx>{`
.buttonMenu{margin:0 - 15px; margin-top:15px;  }
.buttonMenu .group { display: flex; flex-wrap:  wrap;  justify-content: space-between;   flex-wrap: wrap;width:100%;}
.buttonMenu a {width:105px;text-align: center;   display: inline-block;    transition: ease all 0.5s;  background-color: var(--bg-card-color); border-radius: var(--radius); display:inline-block;padding:15px 0;margin:0 15px 30px 15px;}
.buttonMenu a img { display: block; margin: auto auto 10px auto; width: 32px; transition: ease all 0.5s; }
.buttonMenu a span { display: block; font-size: 13px; text-align:center;color:var(--text-color)}
 
.buttonMenu:after { clear: both; content: " "; display: block; }
.buttonMenu .logout{width:100%;background-color:rgba(0 0 0 / 20%);border:solid 1px rgba(255 255 255 / 10%);}  
.buttonMenu .password{width:162px;}
@media   (max-width:960px) {
    .buttonMenu {margin:0  ;}   
    .buttonMenu a {margin:0 0 10px 0;} 
    .buttonMenu a span { font-size:12px;}
    .buttonMenu .logout{margin-top:15px;}
}
        `}</style>
    </>)
}