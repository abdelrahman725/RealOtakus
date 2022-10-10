import async_http_request from './AsyncRequest'
import Select from 'react-select'
import { useState, useRef} from "react"

const ReviewQuestion = ({anime, question, reviewstate, setreviewstate}) => {

const [question_state,setquestion_state] = useState()
const [review_submitted,set_review_submitted] = useState(false)
const [feedback,setfeedback] = useState() 

const feedback_select = useRef(null)

const feedback_options = [
    { value: 'invalid', label: 'invalid' },
    { value: 'too easy', label: 'too easy' },
    { value: 'not correct', label: 'not correct' } ,
    { value: 'choices are similar', label: 'choices are similar' }      
]

const customStyles = {
    container: (provided, state) => ({
        ...provided,
        width:220,
        float:"left"
      }),
}

const ReviewSubmission = (e,question)=>{

    e.preventDefault()
  
    const SubmitReview = async(question)=>{

        const contribution_reviewed_response  = await async_http_request({
            path:"review",
            method:"POST",
            data :{
                "question":question,
                "state": question_state,
                "feedback":feedback ? feedback.value:null 
            }
        })

        console.log(contribution_reviewed_response)

        setreviewstate(prev => ({...prev,[question]:`${question_state=== 1 ? "approve" : "decline" }state`}))
    
    }

    if (question_state === 0 &&  !feedback){
        feedback_select.current.focus()
        return
    }  

    SubmitReview(question)
    set_review_submitted(true)
}

const handle_question_state = (e)=> setquestion_state( parseInt(e.target.value) )

const handle_feedback = selected_option =>  setfeedback(selected_option)    


return (
    <div className={`eachquestion ${reviewstate}`}>
        <p> 
            <span><strong>{anime}</strong></span><br />
            {question.question}
        </p> 
        
        {reviewstate==="reviewstate" &&
            <form onSubmit={(e)=>ReviewSubmission(e,question.id)} className="reviewform">
       
                <div className="radio">

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
             
                <div className="radio">
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
                </div>
             
                <br />
                {question_state=== 0 &&
                 <div>    
                    <Select 
                    className="question_feedback" 
                    styles={customStyles}
                    placeholder="feedback"
                    isClearable = {false}
                    isSearchable ={false} 
                    options={feedback_options}
                    value={feedback}
                    onChange={handle_feedback} 
                    ref={feedback_select}
                    // isMulti = {false}
                    />
                    <br /><br /><br />
                </div>}
                
                {!review_submitted ? <button className="" type="submit">Submit</button>:"loading"}
                
                
            </form>
        }
        
    </div>
)

}

export default ReviewQuestion
