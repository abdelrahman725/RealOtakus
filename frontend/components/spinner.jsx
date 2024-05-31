export default function LoadingSpinner({ error }) {
    return (
        <div className="loading-container centered">
            <h1>RealOtakus</h1>
            {error ?
                <h3>Error connecting to server</h3> :
                <div>
                    <div className="spinner"></div>
                    <strong>loading</strong>
                </div>
            }
        </div>
    )
}