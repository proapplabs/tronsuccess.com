export default function SubmitButton({ action, title }) {
    if (action) {
        return (
            <button name="button btn-gradient">
                <i className="fa fa-refresh fa-spin  fa-fw"></i>
                <span className="sr-only">Loading...</span>
            </button>
        )
    }
    return (
        <button type="submit" name="button" className="btn-gradient ">{title}</button>
    )
}