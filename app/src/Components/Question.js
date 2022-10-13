import async_http_request from "./AsyncRequest"

import { useTimer } from "react-use-precision-timer"
import { useEffect, useState,} from "react"

const Question = ({question,onselect,Q_no,questions_length,nextquestion}) => {

  const [selected,setselected] = useState()
  const [minutes,setminutes] = useState(2)
  const [seconds,setseconds]= useState(0)
  const [timeout,settimout] = useState(false) 

  
  const handletimeleft= ()=>{
    if (seconds > 0) {
          setseconds(seconds - 1);
      }
      if (seconds === 0) {
          if (minutes === 0) {
              if(Q_no===questions_length-1)
              {
                settimout(true)
              }
              timer.stop()
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

  const sendquestioninteraction = async()=>{
    const attempt_response  = await async_http_request({
      path:`interaction/${question.id}`,
      method:"POST"
    })

    //console.log(attempt_response)
  }


  useEffect(()=>{
    sendquestioninteraction()
    setselected()
    !timeout && reset_timer()
  },[Q_no])

      
  const onChoice = (useranswer)=>
  {
    setselected(useranswer)
    onselect(question.id,useranswer)
  }

 const timer = useTimer({ delay: 1000, callback: () => handletimeleft()});
  

  return (
    <div className="centered_div Question">

      <h3> <span> time left :</span> {"0"+minutes}:{seconds < 10&&"0"}{seconds} </h3>
      <br />

    { !timeout ? 

      <div className="question_content">
        <p>
          {Q_no+1}. <strong> {question.question} ? </strong>
        </p>

        <div className={question.choice1===selected?"choice selected_choice":"choice"}
        onClick={()=>onChoice(question.choice1)}>  
        {question.choice1}
        </div>

        <div className={question.choice2===selected?"choice selected_choice":"choice"}
        onClick={()=>onChoice(question.choice2)}>  
        {question.choice2}
        </div>

        <div className={question.choice3===selected?"choice selected_choice":"choice"}
        onClick={()=>onChoice(question.choice3)}>  
        {question.choice3}
        </div>

        <div className={question.choice4===selected?"choice selected_choice":"choice"}
        onClick={()=>onChoice(question.choice4)}>  
        {question.choice4}
        </div>
      </div>
      :
      <p> <strong> Time out !</strong> </p>

    }

    </div>
  )
}

export default Question