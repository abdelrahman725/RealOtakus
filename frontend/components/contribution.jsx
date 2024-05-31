import get_local_date from "./utils/localdate"

import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import ReAuthorizedApiRequest from "./utils/generic_request";
export default function ContributedQuestion({ contribution, feedback_value_to_label, set_contributions }) {

    const delete_question = async () => {
        const result = await ReAuthorizedApiRequest({
            path: "delete/",
            method: "DELETE",
            request_data: {
                "question_id": contribution.id,
            }
        })

        if (result.status_code == 200) {
            toast.success("Question deleted successfully", { position: "top-center" })
            set_contributions(contributions =>
                contributions.filter(c => {
                    return c.id !== contribution.id
                })
            )
        }
    }

    return (
        <div className={`user_contribution ${contribution.state}_question`}>
            {contribution.state === "pending" &&
                <MdDelete
                    onClick={delete_question}
                    className="delete-icon"
                    title="delete question, this action cannot be undone!" />
            }
            <p><strong>{contribution.anime.name}</strong></p>
            <p>{contribution.question}</p>
            <div className="choices">
                <p className="right_answer">{contribution.right_answer}</p>
                <p>{contribution.choice1}</p>
                <p>{contribution.choice2}</p>
                <p>{contribution.choice3}</p>
            </div>
            {contribution.state === "rejected" && <p>feedback : <strong>{feedback_value_to_label[contribution.feedback]}</strong></p>}
            <p className="date_created">{get_local_date(contribution.date_created)}</p>
        </div>
    )
}

