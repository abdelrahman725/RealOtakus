import { useState} from "react"

const Question = ({each_question,onselect,i}) => {
  const [selected,setselected] = useState()
  
  const onChoice = (useranswer)=>
  {
    setselected(useranswer)
    onselect(each_question.id,useranswer)
  }
  


  return (
    <>
    <strong>
      {each_question.question} ? 
      <hr />
    </strong>


    <div className={each_question.choice1===selected?"choice rightchoice":"choice"}
     onClick={()=>onChoice(each_question.choice1)}>  
     {each_question.choice1}
    </div>

    <div className={each_question.choice2===selected?"choice rightchoice":"choice"}
     onClick={()=>onChoice(each_question.choice2)}>  
     {each_question.choice2}
    </div>

    <div className={each_question.choice3===selected?"choice rightchoice":"choice"}
     onClick={()=>onChoice(each_question.choice3)}>  
     {each_question.choice3}
    </div>

    <div className={each_question.choice4===selected?"choice rightchoice":"choice"}
     onClick={()=>onChoice(each_question.choice4)}>  
     {each_question.choice4}
    </div>
    
    <strong>{i+1}</strong><br />
  
    </>
  )
}

export default Question