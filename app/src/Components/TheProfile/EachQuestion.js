import getCookie from "../../GetCookie"
import { ServerContext } from "../../App"
import { useContext, useState, useRef} from "react"
import Select from 'react-select'

const EachQuestion = ({anime,question,reviewstate,setreviewstate}) => {

const {server} = useContext(ServerContext)  
const CsrfToken = getCookie('csrftoken')

const [feedback,setfeedback] = useState() 

const [question_state,setquestion_state] = useState()

const feedback_options = [
    { value: 'invalid', label: 'invalid' },
    { value: 'too easy', label: 'too easy' },
    { value: 'not correct', label: 'not correct' } ,
    { value: 'choices are similar', label: 'choices are similar' }      
]
const feedback_selection = useRef(null)


const ReviewSubmission = (e,question)=>{

    e.preventDefault()
  
    
    const SendReviewState = async(question)=>{
    
        const send = await fetch(`${server}/home/review`,{
            method : 'POST',
            headers : {
            'Content-type': 'application/json',
            'X-CSRFToken': CsrfToken,
            },
            body: JSON.stringify({
            state:question_state,
            question:question
    
            })
        })
    
        const res  = await send.json()
        console.log(res)
    
        setreviewstate(prev => ({...prev,[question]:`${question_state}state`}))
    
        }
    
    
    if (question_state === "decline" &&  !feedback){
        feedback_selection.current.focus()
        return
    }  

    SendReviewState(question)



}
const handle_question_state = (e)=> setquestion_state(e.target.value)
const handle_feedback = (e) => {setfeedback(e.value)}

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
                value="approve"
                name="state"
                checked={question_state=== "approve"}
                onChange={handle_question_state}
                />
                approve
            </label>
            </div>
                <div className="radio">
                <label>
                    <input
                    className="approve_input"
                    required
                    type="radio"
                    value="decline"
                    name="state"
                    checked={question_state=== "decline"}
                    onChange={handle_question_state}
                    />
                    decline
                </label>
                </div><br />

                {question_state=== "decline" &&<div>
                    
                    <Select 
                    className="question_feedback" 
                    placeholder="feedback"
                    isClearable= {true}
                    isSearchable={false} 
                    options={feedback_options}
                    onChange={handle_feedback} 
                    ref={feedback_selection}
                    
                    //isMulti = {true}
                    //closeMenuOnSelect={false}
                    />
                    <br /> 
                </div>}
                <button className="" type="submit">
                    Submit
                </button>
                
                
            </form>
        }
        
    </div>
  )
}

export default EachQuestion
