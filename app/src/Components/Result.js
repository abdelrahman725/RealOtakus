const Result = ({results,useranswers,questions,score}) => {


const get_choice_class=(right_answer,user_answer,choice)=>
{
  if (right_answer===choice){
    return "choice rightchoice"
  }

  if (user_answer===choice && user_answer!==right_answer)
  {    
    return "choice wrongchoice" 
  }

  return "choice"  
}

  return (
    <div className="Result">
    <h2>Resulsts</h2>
    <h3>score  {score}/{questions.length} </h3> 
    <br />  
    <div className="results">
    
      {questions.map((q,index)=>(
     

        <div key={index} className="Question" >
            <p> <strong>{q.question}? </strong> </p>

             <div className={get_choice_class(results[q.id],useranswers[q.id],q.choice1)}>
              {q.choice1}
            </div>

            <div className={get_choice_class(results[q.id],useranswers[q.id],q.choice2)}>
              {q.choice2}
            </div>

            <div className={get_choice_class(results[q.id],useranswers[q.id],q.choice3)}>
              {q.choice3}
            </div>

            <div className={get_choice_class(results[q.id],useranswers[q.id],q.choice4)}>
              {q.choice4}
            </div>
        </div>
          
      ))}

    </div> 
  
      </div>
  )
}

export default Result