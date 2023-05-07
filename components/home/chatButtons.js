export default function ChatButtons() {
    return (
        <section>
            <div className='button'></div>
            <span className="menu-navs"  >
                <a href="https://t.me/oliviaromina" target="_blank" style={{ backgroundImage: "url(https://b.thumbs.redditmedia.com/tjmTLdN1v49BUWeI1q2xtY5mdMG5bV-A2ks1CksPZbA.png)" }}> </a>
                <a href="https://t.me/tronlifesite" target="_blank" style={{ backgroundImage: "url(https://b.thumbs.redditmedia.com/tjmTLdN1v49BUWeI1q2xtY5mdMG5bV-A2ks1CksPZbA.png)" }}> </a>
            </span>
            <style jsx>{`
section{position:fixed;z-index:999999;  transition:ease all 0.5s;top:10%;/* overflow:hidden;border-radius:100%; */} 
section .button{
    background-image:url("/img/icon/chat.jpeg");
 --size: 70px;
   display: inline-block;
   vertical-align: middle;
   width: var(--size);
   height: var(--size);
   border-radius: 50%;
   background-color: #ddd;
   background-size: cover;
   background-position:center;
   box-shadow: 0 0 1.06667vw rgb(0 0 0 / 50%);
   z-index:9999;
   position:relative;
}
section span{white-space:nowrap;position:absolute;  left:-15px; transition:ease all 0.5s; width:90px;overflow:hidden;}
section span a{
 --size: 70px;
   display: inline-block;
   vertical-align: middle;
   margin: 0 15px;
   width: var(--size);
   height: var(--size);
   border-radius: var(--size);
   background-color: var(--text-color,#f59a23);
   line-height: var(--size);
   color: #fff;
   text-align: center; 
transition:ease all 0.5s;
   box-shadow: 0 0 1.06667vw rgb(0 0 0 / 50%);
   opacity:0;
   background-size:cover;
   background-repeat:no-repeat;
   background-position:center;
   
}

section:hover{ overflow:inherit; }
section:hover span{left:75px;width:auto;overflow:inherit;}
section:hover span a{opacity:1;}
  @media (max-width:960px) {
 
  }
           `}</style>
        </section>
    )
}