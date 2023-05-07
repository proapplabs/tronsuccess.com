import Link from "next/link"
import { useRouter } from 'next/router'
export default function TopMenu({ links }) {
    const router = useRouter()
    return (
        <section className="topMenu">
            {links.map((v, i) => {
                const link = v.link
                let status = null
                if (router.asPath == link) {
                    status = 'active '
                }
                return (
                    <Link href={link} key={i}>
                        <a className={status}>{v.title}</a>
                    </Link>
                )
            })}
            <style jsx>{`
.topMenu{margin-bottom: 30px; display: flex;text-align: center; overflow: hidden;}
.topMenu a{transition: ease all 0.5s;display: block;padding: 15px;width: 100%;font-size: 16px; border-bottom:solid 4px rgba(255 255 255 / 10%);}
.topMenu a.active{color:var(--text-color);border-color:var(--text-color);} 
@media (max-width:960px) { 
.topMenu a{  font-size:12px;}
.topMenu a.active{}
}
`}</style>
        </section>
    )
}
/*  <?php
  $links = ;

  foreach ($links as $index => $link)
  {
    $link = (object) $link;
    $class = service('uri')->getSegment(2)==$link->link?'class="active"':'';
    echo '<a href="'.base_url('invest/'.$link->link).'" '.$class.'>'.$link->title.'</a>';
  }
   ?> */