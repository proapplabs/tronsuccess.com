export default function FilterItems() {
    const handleSubmit = async (e) => {
        e.preventDefault()
    }
    const min = "2023-01-03"
    const max = "2023-01-03"
    return (<section>
        <form id="form" method="post" onSubmit={handleSubmit}>
            <input type="date" lang="en" name="min" defaultValue={min} placeholder="Select Date" />
            <input type="date" lang="en" name="max" defaultValue={max} placeholder="Select Date" />
            <button type="submit" />
        </form>
        <style jsx>{` 
section{}
section form{display:flex;gap:60px;padding:0;background-color:rgba(0 0 0/0%);justify-content:space-between;}
section form input{border-color:white; max-width:210px;}
/*section form input{background-image:url(img/icon/calendar.png);background-size:20px;background-repeat:no-repeat;background-position:center;background-color:white !important;}*/
section form button{ background:var(--gradient);position:relative;width:45px;height:32px;}
section form button:after{width:32px;height:32px;content:' ';position:absolute;top:0;bottom:0;left:0;right:0;margin:Auto;background-image:url(/img/icon/search.png); background-size:15px;background-repeat:no-repeat;background-position:center;}
    `}</style>
    </section>)
}