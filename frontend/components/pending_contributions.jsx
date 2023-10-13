import Link from "next/link"
import ReviewContribution from "./reviewcontribution"

export default function PendingConributions({ contributions, set_contributions, set_animes, set_filter }) {

    const feedback_options = [
        { value: 'irr', label: 'not relevant' },
        { value: 'eas', label: 'too easy' },
        { value: 'bad', label: 'bad choices' },
        { value: 'inv', label: 'invalid/wrong information' }
    ]

    return (
        <div className="contributions">
            <h2>{contributions.length} contributions need review</h2>
            <button className="filter_btn" onClick={() => set_filter("reviewed")}>show reviewed</button>

            <p>
                you must read <Link className="simple_link" href="/about#review-guidelines" target={"_blank"} shallow>
                    Review Guidelines
                </Link> before start reviewing
            </p>

            {contributions.map((each_contribution) => (
                <ReviewContribution
                    key={each_contribution.id}
                    contribution_object={each_contribution}
                    set_animes={set_animes}
                    set_contributions={set_contributions}
                    feedback_options={feedback_options}
                />
            ))}
        </div>
    )
}
