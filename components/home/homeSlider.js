export default function HomeSlider() {
    return (
        <section>
            {/* <div style={{ backgroundImage: "url(img/home.gif)" }}>

            </div> */}
            <img src="img/home.png" />
            <style jsx>{`
section{overflow:hidden;margin-bottom:-190px;top:-70px;position:relative;left:-30px;right:-30px;width:calc(100% + 60px);z-index:-9;} 
section img{width:100%;border-radius:var(--radius);}
section div{height:200px;border-radius:var(--radius);background-size:cover;background-position:center;display:Flex;align-items:center;justify-content:center;}
section div p{font-size:40px;color:var(--text-color);text-shadow:0px 0px 9px black;}
   @media (max-width:960px) {
    section{margin-bottom:-130px;}
   }
           `}</style>
        </section>
    )
}