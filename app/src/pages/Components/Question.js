import async_http_request from "./AsyncRequest"
import { useTimer } from "react-use-precision-timer"
import { MdTimer } from "react-icons/md"
import { useEffect, useState } from "react"

const Question = ({ question, onselect, question_index, questions_length, timeout ,settimout, nextquestion }) => {

  const [selected, setselected] = useState()
  const [minutes, setminutes] = useState(2)
  const [seconds, setseconds] = useState(0)

  const handletimeleft = () => {
    if (seconds > 0) {
      setseconds(curr_sec => curr_sec - 1);
    }

    if (seconds === 0) {

      if (minutes === 0) {

        if (question_index === questions_length - 1) {
          settimout(true)
        }
        
        nextquestion()
      }

      else {
        setminutes(curr_min => curr_min - 1);
        setseconds(59);
      }
    }
  }

  const reset_timer = () => {
    setminutes(1)
    setseconds(30)
    timer.start()
  }
 
  const onChoice = (useranswer) => {
    setselected(useranswer)
    onselect(question.id, useranswer)
  }
 
  const sendquestioninteraction = async () => {
    const attempt_response = await async_http_request({
      path: `interaction/${question.id}`,
      method: "POST"
    })

    console.log(attempt_response)
  }

  const timer = useTimer({ delay: 1000, callback : () => handletimeleft() })
  
  useEffect(() => {
  
    setselected()
    sendquestioninteraction()
    !timeout && reset_timer()

    return ()=>{
      timer.stop()
    }
  
  }, [question_index])


  return (
    <div>      
      
      <p className="timer"> <MdTimer className="icon"/> &nbsp;&nbsp;<strong> {"0" + minutes} : {seconds < 10 && "0"}{seconds} </strong> </p>
      
      <div className="game_question">
        
        <p className="question_title"> {question_index + 1}. <strong> {question.question} ? </strong> </p>

        <div className={question.choice1 === selected ? "choice selected_choice" : "choice"}
          onClick={() => onChoice(question.choice1)}>
          {question.choice1}
        </div>

        <div className={question.choice2 === selected ? "choice selected_choice" : "choice"}
          onClick={() => onChoice(question.choice2)}>
          {question.choice2}
        </div>

        <div className={question.choice3 === selected ? "choice selected_choice" : "choice"}
          onClick={() => onChoice(question.choice3)}>
          {question.choice3}
        </div>

        <div className={question.choice4 === selected ? "choice selected_choice" : "choice"}
          onClick={() => onChoice(question.choice4)}>
          {question.choice4}
        </div>
      </div>

    </div>
  )
}

export default Question