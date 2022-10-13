import async_http_request from './AsyncRequest'
import Select from 'react-select'
import { useState, useRef} from "react"

const ReviewQuestion = ({anime, question, reviewstate, setreviewstate}) => {

const [question_state,setquestion_state] = useState()
const [review_submitted,set_review_submitted] = useState(false)
const [info, setinfo]=useState()
const [feedback,setfeedback] = useState() 
const feedback_select = useRef(null)

const feedback_options = [
    { value: 'invalid', label: 'invalid' },
    { value: 'too easy', label: 'too easy' },
    { value: 'not correct', label: 'not correct' } ,
    { value: 'choices are similar', label: 'choices are similar' }      
]


const ReviewSubmission = (e,question)=>{

    e.preventDefault()
  
    const SubmitReview = async(question)=>{
        
        const review_submission_response  = await async_http_request({
            path:"review",
            method:"PUT",
            data :{
                "question":question,
                "state": question_state,
                "feedback":feedback ? feedback.value:null 
            }
        })

        if(review_submission_response===null){
            return
        }

        if (review_submission_response instanceof Response){
            const conflict_result = await review_submission_response.json()
            setreviewstate(prev => ({...prev,[question]:"canceledstate"}))
            setinfo(conflict_result.info)
        } 

        else {
            setinfo(review_submission_response.info)
            setreviewstate(prev => ({...prev,[question]:`${question_state=== 1 ? "approve" : "decline" }state`}))
        }
    
    }

    if (question_state === 0 &&  !feedback){
        feedback_select.current.focus()
        return
    }  

    setinfo()
    set_review_submitted(true)
    SubmitReview(question)
}

const handle_question_state = (e)=> setquestion_state( parseInt(e.target.value) )

const on_feedback_selection = selected_option => {
    setfeedback(selected_option)    
    feedback_select.current.blur()

} 


return (
    <div className={`review_question ${reviewstate}`}>
        <p> <strong>{anime}</strong> </p>
        
        <div className="question"> 
            {question.question}
        </div>
        
        <div className="choices">
            <p>right answer : {question.right_answer}</p>
            <p>choice 1 : {question.choice1}</p>
            <p>choice 2 : {question.choice2}</p>
            <p>choice 3 : {question.choice3}</p>
            <hr />
        </div>

        {reviewstate==="reviewstate" &&
            <form onSubmit={(e)=>ReviewSubmission(e,question.id)}>
                <div className="radios">      
                    <label>
                        <input
                        className="approve_input"
                        required
                        type="radio"
                        value={1}
                        name="state"
                        checked={question_state=== 1}
                        onChange={handle_question_state}
                        />
                        approve
                    </label>
                
                    <label>
                        <input
                        className="decline_input"
                        required
                        type="radio"
                        value={0}
                        name="state"
                        checked={question_state=== 0}
                        onChange={handle_question_state}
                        />
                        decline
                    </label>
                </div>
             
                <br />
                {question_state=== 0 &&
                 
                    <Select 
                    className="question_feedback" 
                    placeholder="feedback"
                    isClearable = {false}
                    isSearchable ={false} 
                    options={feedback_options}
                    value={feedback}
                    onChange={on_feedback_selection} 
                    ref={feedback_select}
                    // isMulti = {false}
                    />
                }
                
                {!review_submitted ? <button type="submit">Submit</button>:"loading"}
                

            </form>
        }

        <div>{info}</div>
    </div>
)

}

export default ReviewQuestion
