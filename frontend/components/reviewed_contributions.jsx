import ReviewContribution from "./reviewcontribution"

export default function ReviewedConributions({ contributions, set_filter }) {

    return (
        <div className="contributions">
            <h2>{contributions.length} reviewed contributions</h2>
            <button className="pending_filter_btn" onClick={() => set_filter("pending")}>show pending</button>

            {contributions.map((each_contribution) => (
                <ReviewContribution
                    key={each_contribution.id}
                    contribution_object={each_contribution}
                />
            ))}
        </div>
    )
}

