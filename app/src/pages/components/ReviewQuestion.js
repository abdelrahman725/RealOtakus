import async_http_request from './AsyncRequest'
import Select from 'react-select'
import { useState, useRef } from "react"
import { SelectStyles } from "Constants"
import get_local_date from "./LocalDate"

const ReviewQuestion = ({
    contribution_object,
    set_animes,
    contribution_class,
    set_contributors_contributions,
    feedback_options
}) => {

    const [question_state, setquestion_state] = useState(null)
    const [review_submitted, set_review_submitted] = useState(false)
    const [info, setinfo] = useState()
    const [invalid_review, set_invalid_review] = useState()
    const [feedback, setfeedback] = useState()
    const feedback_select = useRef(null)

    const pre_submit_review = (e) => {

        e.preventDefault()

        const submit_review = async () => {

            const review_submission_response = await async_http_request({
                path: "get_review_contribution",
                method: "PUT",
                data: {
                    "contribution": contribution_object.id,
                    "state": question_state,
                    "feedback": feedback ? feedback.value : null
                }
            })

            if (review_submission_response === null) {
                return
            }

            if (review_submission_response.status !== 200) {
                set_invalid_review("canceledstate")
                setinfo(review_submission_response.payload.info)

                setTimeout(() => {
                    set_contributors_contributions(current_contributions =>
                        current_contributions.filter(contribution => {
                            return contribution.id !== contribution_object.id
                        })
                    )
                }, 3500)
            }

            else {
                set_contributors_contributions(contributions =>
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

                setinfo(review_submission_response.payload.info)
            }

        }

        if (question_state === null) {
            setinfo("review required first")
            return
        }

        if (question_state === 0 && !feedback) {
            feedback_select.current.focus()
            return
        }

        setinfo()
        set_review_submitted(true)
        submit_review()
    }

    const handle_question_state = (e) => {
        const value = parseInt(e.target.value)
        value === 1 && setfeedback()
        setquestion_state(value)
    }

    const on_feedback_selection = selected_option => {
        setfeedback(selected_option)
        feedback_select.current.blur()
    }


    return (
        <div className={`each_question_for_review_container ${invalid_review ? invalid_review : contribution_class}`}>
            <p className="question_anime"> <strong>{contribution_object.anime.anime_name}</strong></p>
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

            {contribution_object.approved === null && !invalid_review &&
                <form onSubmit={(e) => pre_submit_review(e)}>
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
                                onChange={handle_question_state} />
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
                                onChange={handle_question_state}
                            />
                            <span className="decline_checkmark"></span>
                        </label>
                    </div>

                    <br />
                    {question_state === 0 &&
                        <Select
                            styles={SelectStyles}
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
            <div>{info}</div>
        </div>
    )

}

export default ReviewQuestion
