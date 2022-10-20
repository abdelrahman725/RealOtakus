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
    { value: 1, label: 'invalid format' },
    { value: 2, label: 'Q is not clear' },
    { value: 3, label: 'wrong information' },
    { value: 4, label: 'easy / predictable' },
    { value: 5, label: 'choices are similar' }    
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
                "feedback":feedback ? feedback.label:null 
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
            <p>right answer  {question.right_answer}</p>
            wrong choices
            <ul>   
                <li> {question.choice1}</li>
                <li> {question.choice2}</li>
                <li> {question.choice3}</li>
            </ul>
            <hr />
        </div>

        {reviewstate==="pendingstate" &&
            <form onSubmit={(e)=>ReviewSubmission(e,question.id)}>

                 <div className="radios">
                    <label>
                        approve
                        <input
                        className="approve_input"
                        required
                        type="radio"
                        value={1}
                        name="state"
                        checked={question_state=== 1}
                        onChange={handle_question_state}/>
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
                        checked={question_state=== 0}
                        onChange={handle_question_state}
                        />
                        <span className="decline_checkmark"></span>
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
                    isMulti = {false}
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
