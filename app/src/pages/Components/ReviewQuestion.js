import async_http_request from './AsyncRequest'
import Select from 'react-select'
import { useState, useRef, useContext } from "react"
import { GlobalStates } from '../../App'
import get_local_date from './LocalDate'

const ReviewQuestion = ({ id, question, anime, date, reviewstate, setreviewstate }) => {

    const { SelectStyles } = useContext(GlobalStates)
    const [question_state, setquestion_state] = useState()
    const [review_submitted, set_review_submitted] = useState(false)
    const [info, setinfo] = useState()
    const [feedback, setfeedback] = useState()
    const feedback_select = useRef(null)

    const feedback_options = [
        { value: 1, label: 'not clear' },
        { value: 2, label: 'similar choices' },
        { value: 3, label: 'too easy' },
        { value: 4, label: 'wrong information' }
    ]

    const pre_submit_review = (e) => {

        e.preventDefault()

        const submit_review = async () => {

            const review_submission_response = await async_http_request({
                path: "get_review_contribution",
                method: "PUT",
                data: {
                    "contribution": id,
                    "state": question_state,
                    "feedback": feedback ? feedback.label : null
                }
            })

            if (review_submission_response === null) {
                return
            }

            if (review_submission_response instanceof Response) {
                const conflict_result = await review_submission_response.json()
                setreviewstate(prev => ({ ...prev, [id]: "canceledstate" }))
                setinfo(conflict_result.info)
            }

            else {
                setinfo(review_submission_response.info)
                setreviewstate(prev => ({ ...prev, [id]: `${question_state === 1 ? "approve" : "decline"}state` }))
            }

        }

        if (question_state !== 0 && question_state !== 1) {
            console.log("error! a review decision is required for the review (approve/decline)")
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
        <div className={`each_question_for_review_container ${reviewstate}`}>
            <p className="question_anime"> <strong>{anime}</strong></p>
            <p>{get_local_date(date)}</p>
            <div className="question_contents">
                <p className="question">{question.question}</p>
                <div className="choices">
                    <p className="right_answer"> {question.right_answer}</p>
                    <p> {question.choice1}</p>
                    <p> {question.choice2}</p>
                    <p> {question.choice3}</p>
                </div>
            </div>

            {reviewstate === "pendingstate" &&

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
                            isMulti={false}
                        />
                    }
                    <div className="submit_container">
                        {!review_submitted ? <button type="submit">Submit</button> : "loading"}
                    </div>

                </form>
            }
            <div>{info}</div>
        </div>
    )

}

export default ReviewQuestion
