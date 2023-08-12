import async_http_request from "./AsyncRequest"
import { useTimer } from "react-use-precision-timer"
import { MdTimer } from "react-icons/md"
import { useEffect, useState } from "react"
import { N_Game_Questions, QUESTION_TIME_MIN, QUESTION_TIME_SEC } from "Constants"

const Question = ({ question, onselect, question_index, timeout, settimout, nextquestion }) => {

  const [selected, setselected] = useState()
  const [minutes, setminutes] = useState(1)
  const [seconds, setseconds] = useState(40)

  const handletimeleft = () => {
    if (seconds > 0) {
      setseconds(curr_sec => curr_sec - 1);
    }

    if (seconds === 0) {

      if (minutes === 0) {

        if (question_index === N_Game_Questions - 1) {
          settimout(true)
        }

        else {
          nextquestion()
        }

      }

      else {
        setminutes(curr_min => curr_min - 1);
        setseconds(59);
      }
    }
  }

  const reset_timer = () => {
    setminutes(QUESTION_TIME_MIN)
    setseconds(QUESTION_TIME_SEC)
    timer.start()
  }

  const onChoice = (useranswer) => {
    if (timeout === true) {
      return
    }

    setselected(useranswer)
    onselect(question.id, useranswer)
  }

  const sendquestioninteraction = async () => {
    async_http_request({
      path: `interaction/${question.id}`,
      method: "POST"
    })
  }

  const timer = useTimer({ delay: 1000, callback: () => handletimeleft() })

  useEffect(() => {

    setselected()
    sendquestioninteraction()
    !timeout && reset_timer()

    return () => {
      timer.stop()
    }
    // eslint-disable-next-line
  }, [question_index])


  return (
    <div>

      <p className="timer"> <MdTimer className="icon" /> &nbsp;&nbsp;<strong> {"0" + minutes} : {seconds < 10 && "0"}{seconds} </strong> </p>

      <div className={`game_question ${timeout ? "disabled_question" : "question_x"}`}>

        <p> {question_index + 1}. <strong> {question.question} ? </strong> </p>

        <div disabled={true} className={question.choice1 === selected ? "choice selected_choice" : "choice"}
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