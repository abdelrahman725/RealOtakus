
function EachQuestion({id,R,question_content,advanced,choice1,choice2,choice3,right_answer,counter})
{

  const handleChange =(e)=>
  {
    console.log(e.target.value)
  }
  
  return(
    

   <div className="EachQuestion" >
     
     <div className="question" >
        <strong>
        {counter}:   {question_content} ?
        </strong> 
      <div className="choices">
      <input type="radio" id="choice1" name={`choice${id+2}`} value={choice1}/>
      <label htmlFor="choice1">{choice1}</label><br/>

      <input type="radio" id="html" name={`choice${id+2}`} value={choice2}/>
      <label htmlFor="choice2">{choice2}</label><br/>

      <input type="radio" id="html" name={`choice${id+2}`} value={choice3}/>
      <label htmlFor="choice3">{choice3}</label><br/>

      <input type="radio" id="right_answer" name={`choice${id+2}`} value={right_answer} onChange={handleChange}/>
       <label htmlFor="right_answer">{right_answer}</label><br/>
       

        {/* {
          R===1&&
        <ul>
          <li>1. {right_answer}</li>
          <li>2. {choice2}</li>
          <li>3. {choice3}</li>
          <li>4. {choice1}</li>
        </ul>
        }

        {
          R===2&&
        <ul>
          <li>1. {choice1}</li>
          <li>2. {right_answer}</li>
          <li>3. {choice3}</li>
          <li>4. {choice2}</li>
        </ul>
        }

        {
          R===3&&
        <ul>
          <li>1. {choice1}</li>
          <li>2. {choice2}</li>
          <li>3. {right_answer}</li>
          <li>4. {choice3}</li>
        </ul>
        }

        {
          R===4&&
        <ul>
          <li>1. {choice1}</li>
          <li>2. {choice2}</li>
          <li>3. {choice3}</li>
          <li>4. {right_answer}</li>
        </ul>
        } */}
          
      </div>
     </div>
     <hr />
     <br />
   </div>
  )

}

export default EachQuestion
