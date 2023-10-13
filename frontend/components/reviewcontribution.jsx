import Select from 'react-select'
import { toast } from "react-toastify";
import { useState, useRef } from "react"
import { ReactSelectStyles } from './utils/constants'
import get_local_date from './utils/localdate'
import ReAuthorizedApiRequest from "./utils/generic_request";

export default function ReviewContribution({
    contribution_object,
    set_animes,
    set_contributions,
    feedback_options
}) {

    const [question_state, setquestion_state] = useState(null)
    const [review_submitted, set_review_submitted] = useState(false)
    const [invalid_contribution, set_invalid_contribution] = useState(false)
    const [feedback, setfeedback] = useState()
    const feedback_select = useRef(null)

    const get_border_color = () => {
        if (invalid_contribution) {
            return "InactiveBorder"
        }

        if (contribution_object.approved === true) {
            return "#46bb5d"
        }

        if (contribution_object.approved === false) {
            return "#e76450"
        }

        return "#f0ba56"
    }

    const submit_review = async () => {
        const result = await ReAuthorizedApiRequest({
            path: "review/",
            method: "PUT",
            req_data: {
                "contribution": contribution_object.id,
                "state": question_state,
                "feedback": feedback ? feedback.value : null
            }
        })

        if (result === null) {
            return
        }

        set_review_submitted(false)

        if (result.status_code === 410 || result.status_code === 409) {
            set_invalid_contribution(true)
            setTimeout(() => {
                set_contributions(current_contributions =>
                    current_contributions.filter(contribution => {
                        return contribution.id !== contribution_object.id
                    })
                )
            }, 4000)
            toast.info(result.status_code === 410 ? "question doesn't exist anymore" : "question has already been reviewed", { position: "top-center" })
            return
        }

        if (result.status_code === 204) {

            set_contributions(contributions =>
                contributions.map(contribution => {
                    if (contribution.id === contribution_object.id) {
                        return {
                            ...contribution, approved: question_state === 1 ? true : false
                        }
                    }

                    return contribution
                })
            )

            set_animes(animes =>
                animes.map(obj => {
                    if (obj.id === contribution_object.anime.id) {
                        return {
                            ...obj, reviewed_contributions: obj.reviewed_contributions + 1
                        }
                    }

                    return obj
                })
            )
            return
        }

        toast.info("an error occurred")
    }

    const validate_and_submit = (submit_event) => {
        submit_event.preventDefault()

        if (question_state === 0 && !feedback) {
            feedback_select.current.focus()
            return
        }

        set_review_submitted(true)
        submit_review()
    }

    const on_review_change = (e) => {
        const value = parseInt(e.target.value)
        value === 1 && setfeedback()
        setquestion_state(value)
    }

    const on_feedback_selection = selected_option => {
        setfeedback(selected_option)
        feedback_select.current.blur()
    }

    return (
        <div className="review_container" style={{ borderColor: get_border_color() }}>
            <p className="question_anime"> <strong>{contribution_object.anime.name}</strong></p>
            <p className="date_created">{get_local_date(contribution_object.date_created)}</p>
            <div className="question_contents">
                <p className="question">{contribution_object.question}</p>
                <div className="choices">
                    <p className="right_answer"> {contribution_object.right_answer}</p>
                    <p> {contribution_object.choice1}</p>
                    <p> {contribution_object.choice2}</p>
                    <p> {contribution_object.choice3}</p>
                </div>
            </div>

            {contribution_object.approved === null && !invalid_contribution &&
                <form onSubmit={(e) => validate_and_submit(e)}>
                    <div className="radios">
                        <label>
                            approve
                            <input
                                className="approve_input"
                                required
                                type="radio"
                                value={1}
                                name="state"
                                checked={question_state === 1}
                                onChange={on_review_change} />
                            <span className="approve_checkmark"></span>
                        </label>

                        <label>
                            reject
                            <input
                                className="decline_input"
                                required
                                type="radio"
                                value={0}
                                name="state"
                                checked={question_state === 0}
                                onChange={on_review_change}
                            />
                            <span className="decline_checkmark"></span>
                        </label>
                    </div>

                    {question_state === 0 &&
                        <Select
                            styles={ReactSelectStyles}
                            className="question_feedback"
                            placeholder="feedback"
                            isClearable={false}
                            isSearchable={false}
                            options={feedback_options}
                            value={feedback}
                            onChange={on_feedback_selection}
                            ref={feedback_select}
                        />
                    }
                    <div className="submit_container">
                        {!review_submitted ? <button type="submit" className="submit_btn">Submit</button> : "loading"}
                    </div>

                </form>
            }
        </div>
    )

}