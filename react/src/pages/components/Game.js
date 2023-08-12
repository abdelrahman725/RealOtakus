import React from 'react'
import Question from "./Question"
import { FiAlertTriangle } from 'react-icons/fi'
import { GlobalStates } from "App"
import { useContext, useState, useEffect } from "react"
import async_http_request from "./AsyncRequest"
import { N_Game_Questions } from "Constants"

const Game = ({
  questions,
  useranswers,
  setuseranswers,
  setquizresults,
  setgame_score,
  set_game_info
}) => {

  const { setgame_started, set_user_data } = useContext(GlobalStates)
  const [index, setindex] = useState(0)
  const [timeout, settimout] = useState(false)

  const SubmitGame = async () => {

    window.scrollTo({ top: 0 })

    setgame_started(false)

    const game_results = await async_http_request({
      path: "submitgame",
      method: "POST",
      data: { "answers": useranswers }
    })

    const answers = {}
    let score = 0

    game_results.payload.right_answers.forEach((question) => ((
      answers[question.id] = question.right_answer,
      question.right_answer === useranswers[question.id] && (score += 1)

    )))

    set_user_data(prev => ({
      ...prev,
      points: prev.points + score,
      tests_completed: prev.tests_completed + 1,
    }))

    setgame_score(score)
    setquizresults(answers)
  }

  const onChoiceSelect = (id, each_new_answer) => {
    const new_answers = useranswers
    new_answers[id] = each_new_answer
    setuseranswers(new_answers)
  }

  const nextquestion = () => setindex(prev => prev + 1)


  useEffect(() => {

    window.scrollTo({ top: 0 })

    window.onbeforeunload = () => {
      return true
    }

    document.onvisibilitychange = () => {
      if (questions && document.visibilityState === "hidden") {
        set_game_info("Sorry your quiz is canceled because you left the page, you shouldn't do so")
        setgame_started(null)
      }
    }

    return () => {
      document.onvisibilitychange = null
      window.onbeforeunload = null
    }
    // eslint-disable-next-line
  }, [questions])

  return (
    <div className="game_container">

      {questions ?
        <div>
          <p className="warning">
            <FiAlertTriangle className="warning_icon" />Do not leave current page or switch tabs, your progress will be lost.
          </p>

          <Question
            question={questions[index]}
            question_index={index}
            onselect={onChoiceSelect}
            timeout={timeout}
            settimout={settimout}
            nextquestion={nextquestion} />

          <div className="game_buttons">
            {index === N_Game_Questions - 1 ?
              <button onClick={SubmitGame} className="submit_btn"> Submit </button>
              :
              <button onClick={nextquestion} className="next_btn darker_on_hover"> next </button>
            }
          </div>

        </div>
        :
        <div>loading quiz...</div>
      }
    </div>
  )
}

export default Game