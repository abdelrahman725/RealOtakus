export default function LoadingSpinner({ error }) {
    return (
        <div className="centered">
            {error ? <h1>network error</h1> : <div className="spinner"></div>}
        </div>
    )
}