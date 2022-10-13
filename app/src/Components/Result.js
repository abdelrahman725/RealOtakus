const Result = ({results, useranswers, questions, score,n_quiz_questions}) => {

const get_choice_class=(right_answer,user_answer,choice)=>{
  if (right_answer===choice){
    return "choice rightchoice"
  }

  if (user_answer===choice && user_answer!==right_answer){    
    return "choice wrongchoice" 
  }

  return "choice"  
}

  return (
    <div className="centered_div Result">
    <h2>Resulsts</h2>
    <h3>score  {score} / {n_quiz_questions} </h3> 
    <br />  
      {questions.map((q,index)=>(
    
        <div className="centered_div Question" key={index}>
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

            <hr style={{margin:"100px 0px"}}/>
        </div>
          
      ))}
  
    </div>
  )
}

export default Result