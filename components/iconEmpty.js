export default function IconEmpty({ title, content }) {
    return (
        <section className='iconEmpty'>

            <img src="/img/file.png" alt="" />

            <h3>{title}</h3>
            <p>{content}</p>
            <style jsx>{`
.iconEmpty{text-align:center;}
.iconEmpty .icon{background-color:rgba(255 255 255 / 5%);width:20%;margin:auto;padding:50px;border-radius:100%;border-bottom:solid 1px rgba(0 0 0 / 20%);border-top:solid 1px rgba(255 255 255 / 20%);}
.iconEmpty .icon img{width:100%;opacity:1;}
@media (max-width:960px) {
    .iconEmpty .icon{padding:25px;width:30%;}
    .iconEmpty .icon img{width:100%;}
}

    `}</style>
        </section>
    )
}