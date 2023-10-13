import get_local_date from "./utils/localdate"

export default function ContributedQuestion({ contribution, feedback_value_to_label }) {

    return (
        <div className={`user_contribution ${contribution.approved === true ? "approved_question" : contribution.approved === false ? "rejected_question" : "pending_question"}`}>
            <p><strong>{contribution.anime.name}</strong></p>
            <p>{contribution.question}</p>
            <div className="choices">
                <p className="right_answer">{contribution.right_answer}</p>
                <p>{contribution.choice1}</p>
                <p>{contribution.choice2}</p>
                <p>{contribution.choice3}</p>
            </div>
            {contribution.approved === false && <p>feedback : <strong>{feedback_value_to_label[contribution.feedback]}</strong></p>}
            <p className="date_created">{get_local_date(contribution.date_created)}</p>
        </div>
    )
}

