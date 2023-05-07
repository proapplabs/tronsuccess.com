export default function Loading() {
  return (
    <section className="loading  ">

      <div>

      </div>


      <style jsx global>{`
            .loading{
                position:fixed;top:0;bottom:0;left:0;right:0;
                background-color:var(--bg-color); 
                background-image:url("/img/loading.gif");
              background-position:center;
              background-repeat:no-repeat;
              background-size:40px;
                justify-content: center;
                align-items: center;
                display: flex;
                max-width: 680px;
                margin:auto;
                text-align:center;
                z-index:99999999999 !important;
            }
            @media (max-width:960px) {
              .loading {
                  max-width: 100%; 
              }
            }
            .loading i{ color:var(--text-color); }
            .loading i:before{ text-shadow:1px 1px 40px #ffeb3b, 1px 1px 100px #ffeb3b; }
           
              
        `}</style>
    </section>
  )
}