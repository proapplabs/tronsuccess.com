export default function profitForm() {
    return (
        <form className='profitForm'>
            <input type="date" />
            <input type="date" />
            <button><i className='fa fa-search' /></button>

            <style jsx>{`
            .profitForm{display:flex;gap:30px;}
            .profitForm button{width:100px;border-radius:var(--radius)}

    `}</style>
        </form>
    )
}