import { useEffect, useState} from "react"
import { useTimer } from "react-use-precision-timer";


const Question = ({each_question,onselect,Q_no,questions_length,nextquestion}) => {
  const [selected,setselected] = useState()

  const [minutes,setminutes] = useState(2)
  const [seconds,setseconds]= useState(0)
  const [timeout,settimout] = useState(false) 

  
  const onChoice = (useranswer)=>
  {
    setselected(useranswer)
    onselect(each_question.id,useranswer)
  }

  
const handletimeleft= ()=>{
   if (seconds > 0) {
        setseconds(seconds - 1);
    }
    if (seconds === 0) {
        if (minutes === 0) {
            if(Q_no===questions_length-1)
            {
              settimout(true)
              timer.stop()
            }
            nextquestion()

        } else {
            setminutes(minutes - 1);
            setseconds(59);
        }    } 

}
const reset_timer= ()=>
{  
  setminutes(2)
  setseconds(0)
  timer.start()
}

useEffect(()=>{
  setselected()
  !timeout&&  reset_timer()
  },[Q_no])

const timer = useTimer({ delay: 1000, callback: () => handletimeleft()});
  

  return (
    <div className="Question">

      <h3> <span> time left :</span> {"0"+minutes}:{seconds < 10&&"0"}{seconds} </h3>
      <br />


      {!timeout?<div className="question_content">

        <p>
          {Q_no+1}. <strong> {each_question.question} ? </strong>
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
      </div>:
        <p>
        <strong> Time out !</strong>
       </p>

    }


  
    </div>
  )
}

export default Question