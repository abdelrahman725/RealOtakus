import Question from "./Question"
import { GlobalStates } from "../../App"
import { useContext, useState, useEffect } from "react"
import async_http_request from "./AsyncRequest"

const Game = ({
  questions,
  useranswers,
  setuseranswers,
  setquizresults,
  setgame_score,
  set_exit_game
}) => {

  const { N_Game_Questions, setgame_started, set_user_data } = useContext(GlobalStates)
  const [index, setindex] = useState(0)
  const [timeout, settimout] = useState(false)

  const SubmitGame = async () => {

    window.scrollTo({ top: 0, behavior: 'smooth' })

    setgame_started(false)

    const game_results = await async_http_request({
      path: "submitgame",
      method: "POST",
      data: { "answers": useranswers }
    })

    const answers = {}
    let score = 0

    game_results.right_answers.map((question) => ((
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

  const nextquestion = () => index < N_Game_Questions - 1 && setindex(index + 1)

  useEffect(() => {

    window.onbeforeunload = () => {
      return true
    }

    document.onvisibilitychange = () => {
      if (document.visibilityState === "hidden") {
        set_exit_game(true)
        setgame_started()
      }
    }

    return () => {
      document.onvisibilitychange = null
      window.onbeforeunload = null
    }

  }, [])

  return (
    <div className="game_container">
      {questions ?
        <div>
          <br />
          <Question
            question={questions[index]}
            question_index={index}
            onselect={onChoiceSelect}
            questions_length={N_Game_Questions}
            timeout={timeout}
            settimout={settimout}
            nextquestion={nextquestion} />
          <br />
          <div className="game_buttons">
            {index === N_Game_Questions - 1 ?
              <button onClick={SubmitGame} className="submit_btn"> Submit </button>
              :
              <button onClick={nextquestion} className="next_btn darker_on_hover"> next </button>
            }
          </div>
          <br />
          <p> Do not leave current page (e.g. switch tabs), your progress will be lost</p>
          <br />
        </div>
        :
        <div className="loading_div">
          loading quiz ...
        </div>
      }
    </div>
  )
}

export default Game