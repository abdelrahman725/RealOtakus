import { useEffect, useState} from "react"

const Question = ({each_question,onselect,Q_no}) => {
  const [selected,setselected] = useState()
  
  const onChoice = (useranswer)=>
  {
    setselected(useranswer)
    onselect(each_question.id,useranswer)
  }

 useEffect(()=>{
  setselected() 
  },[Q_no])
  
  return (
    <div className="Question">

    <p>
        <strong>
          {each_question.question} ? 
        </strong>
    </p>


    <div className={each_question.choice1===selected?"choice selected_choice":"choice"}
     onClick={()=>onChoice(each_question.choice1)}>  
     {each_question.choice1}
    </div>

    <div className={each_question.choice2===selected?"choice selected_choice":"choice"}
     onClick={()=>onChoice(each_question.choice2)}>  
     {each_question.choice2}
    </div>

    <div className={each_question.choice3===selected?"choice selected_choice":"choice"}
     onClick={()=>onChoice(each_question.choice3)}>  
     {each_question.choice3}
    </div>

    <div className={each_question.choice4===selected?"choice selected_choice":"choice"}
     onClick={()=>onChoice(each_question.choice4)}>  
     {each_question.choice4}
    </div>

  
    </div>
  )
}

export default Question