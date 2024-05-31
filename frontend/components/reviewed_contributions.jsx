import ReviewContribution from "./reviewcontribution"

export default function ReviewedConributions({ contributions, set_filter }) {

    return (
        <div className="contributions">
            <h2>{contributions.length} reviewed contributions</h2>
            <button className="pending_filter_btn" onClick={() => set_filter("pending")}>show pending</button>

            {contributions.map((c) => (
                <ReviewContribution key={c.id} contribution_object={c} />
            ))}
        </div>
    )
}

