import { N_Game_Questions } from "Constants"

const Result = ({ results, useranswers, questions, score }) => {

  const get_choice_class = (right_answer, user_answer, choice) => {

    if (right_answer === choice) {
      return "choice rightchoice"
    }

    if (user_answer === choice && user_answer !== right_answer) {
      return "choice wrongchoice"
    }

    return "choice"
  }

  return (
    <div className="game_container">
      {Object.keys(results).length > 0 ?

        <div>
          <h2>Score {score} / {N_Game_Questions} </h2>
          <br />
          {questions.map((q, index) => (
            <div className="game_question result_question" key={index}>

              <p>{index + 1}.  <strong>{q.question}? </strong> </p>

              <div className={get_choice_class(results[q.id], useranswers[q.id], q.choice1)}>
                {q.choice1}
              </div>

              <div className={get_choice_class(results[q.id], useranswers[q.id], q.choice2)}>
                {q.choice2}
              </div>

              <div className={get_choice_class(results[q.id], useranswers[q.id], q.choice3)}>
                {q.choice3}
              </div>

              <div className={get_choice_class(results[q.id], useranswers[q.id], q.choice4)}>
                {q.choice4}
              </div>

            </div>

          ))}

        </div>
        :
        <div className="loading_div">
          fetching results ...
        </div>
      }
    </div>
  )
}

export default Result