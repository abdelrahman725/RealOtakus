import { useState } from "react"
import Choice from "./Choice"

function EachQuestion({question,n,onChoose})
{

  const [Selected,setSelected] = useState("")


  const handleChange = (e)=>
  {
      setSelected(e.target.value)
     onChoose(e.target.value===question.right_answer?true:false)
  }
  return(
    

   <div className="EachQuestion" >
     
     <div className="question" >
        <strong className="question_title">
         {n+1}. {question.question} ?
        </strong> 
        <hr />

      
        <label>
          <input type="radio" 
          onChange={handleChange}
          name={`choice/${question.id}`}
          checked={Selected===question.right_answer}
          value={question.right_answer}
          className="choice"/>
          {question.right_answer}
        </label>
        <br/>


        <label>
          <input type="radio" 
          onChange={handleChange}
          name={`choice/${question.id}`}
          checked={Selected===question.choice1}
          value={question.choice1}
          className="choice"/>
          {question.choice1}
        </label>
        <br/>

        <label>
          <input type="radio" 
          onChange={handleChange}
          name={`choice/${question.id}`}
          checked={Selected===question.choice2}
          value={question.choice2}
          className="choice"/>
          {question.choice2}
        </label>
        <br/>

        <label>
          <input type="radio" 
          onChange={handleChange}
          name={`choice/${question.id}`}
          checked={Selected===question.choice3}
          value={question.choice3}
          className="choice"/>
          {question.choice3}
        </label>
        <br/>

     </div>
     <br />
   </div>
  )

}

export default EachQuestion
