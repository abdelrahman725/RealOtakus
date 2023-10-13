import { N_Quiz_Questions } from "@/components/utils/constants"
import { useGlobalContext } from "@/contexts/GlobalContext"

export default function QuizResult({ results, useranswers, questions, score }) {

    const { SetQuizStarted } = useGlobalContext()

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
        <div className="results">

            <h2>Score {score} / {N_Quiz_Questions} </h2>

            <button onClick={() => SetQuizStarted(null)} >Take another quiz</button>

            {questions.map((q, index) => (
                <div className="quiz_question" key={index}>

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

        </div >
    )
}

