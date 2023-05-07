import Script from "next/script";
import Link from "next/link";
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
export default function NavigationBottom() {
    const router = useRouter()
    const { t, lang } = useTranslation();
    const links = [
        {
            title: t("common:home"),
            link: "/",
        },
        {
            title: t("common:trading"),
            link: "/trading",
        },
        {
            title: t("common:invest"),
            link: "/invest/products",
        },
        {
            title: t("common:share"),
            link: "/share",
        },
        {
            title: t("common:mine"),
            link: "/mine",
        }
    ];

    //  animate__animated animate__fadeInUp
    let linkCurrent = router.asPath.split('/')[1]
    const page = router.pathname.split('/')

    let show = true
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
    if (show) {
        return (<div  >
            <section className="navigationBottom " >
                <div className="container">
                    <div className="links">
                        {links.map((data, index) => {
                            let status = index
                            let linkFocus = data.link.split('/')[1]
                            if (linkCurrent == linkFocus) {
                                status = 'active/' + index
                            }
                            let icon = '/img/icon/nav/' + status + '.png';
                            return (<Link href={data.link} key={index} >
                                <a className={linkCurrent == linkFocus ? 'active' : null}>
                                    <img src={icon} />
                                    {data.title}
                                </a>
                            </Link>);
                        })}
                    </div>
                </div>
            </section>
            <style jsx>{`
    .navigationBottom { position: fixed; bottom: 0;left:0;right:0;z-index: 99999999;}
    .navigationBottom:hover a { transform: scale(1); /*filter:blur(1px);*/ }
    .navigationBottom .links{background-color: var(--bg-card-color); border-radius: var(--radius) var(--radius) 0 0; display: flex; backdrop-filter: blur(15px);width:100%;  }
    .navigationBottom a{ display: block; width: 100%; padding: 30px 15px; text-align: center; transition: ease all 0.5s;font-size:20px; font-weight:bold; }
 
    .navigationBottom a img { display: block; margin: auto auto 10px auto; max-width: 50%;}
    .navigationBottom a span { display: block;}
    .navigationBottom  .active  { color:var(--text-color) !important;}
    .navigationBottom .container{padding:0 0;}
    @media (max-width:960px) {
      .navigationBottom{min-width: 100%;left: 0;right: 0;}
      .navigationBottom a{font-size: 8px;padding: 15px 0;text-transform:uppercase;max-width:20%;text-align:center;}
      .navigationBottom a  {font-size:13px;}
      .navigationBottom a img {max-width: 40%;}
      .navigationBottom .container{padding:0;}
    }
            `}</style>
        </div>)
    } else {
        return (<></>)
    }

}