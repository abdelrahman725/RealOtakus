"use client"

import ReAuthorizedApiRequest from "./utils/generic_request";
import { useTimer } from "react-use-precision-timer"
import { FcClock } from "react-icons/fc";
import { useEffect, useState } from "react"
import { N_Quiz_Questions, QUESTION_TIME_MIN, QUESTION_TIME_SEC } from "@/components/utils/constants";

export default function Question({
    question,
    onselect,
    question_index,
    nextquestion,
    timeout,
    settimout
}) {

    const [selected_choice, set_selected_choice] = useState()
    const [minutes, setminutes] = useState(QUESTION_TIME_MIN)
    const [seconds, setseconds] = useState(QUESTION_TIME_SEC)

    const get_choice_class = (choice) => {
        if (choice === selected_choice) {
            return "choice selected_choice"
        }
        return "choice"
    }

    const handletimeleft = () => {
        if (timeout) {
            return
        }

        if (seconds > 0) {
            setseconds(curr_sec => curr_sec - 1);
        }

        if (seconds === 0) {

            if (minutes === 0) {

                if (question_index === N_Quiz_Questions - 1) {
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

    const start_or_reset_timer = () => {
        if (!timeout) {
            setminutes(QUESTION_TIME_MIN)
            setseconds(QUESTION_TIME_SEC)
            timer.start()
        }
    }

    const onChoice = (useranswer) => {
        if (timeout === true) {
            return
        }
        set_selected_choice(useranswer)
        onselect(question.id, useranswer)
    }

    const timer = useTimer({ delay: 1000 }, handletimeleft);

    useEffect(() => {
        set_selected_choice()

        //record current question interaction, no need to await the request, it takes place in background
        ReAuthorizedApiRequest({
            path: `quiz/interact/`,
            method: "POST",
            req_data: { "question": question.id }
        })

        start_or_reset_timer()

        return () => timer.stop()

    }, [question_index])


    return (
        <div>
            <p className="timer">
                <FcClock className="timer_icon" />
                <span>{"0" + minutes} :</span><span>{seconds < 10 && "0"}{seconds}</span>
            </p>

            <div className="quiz_question" disabled={timeout}>
                <p> {question_index + 1}. <strong> {question.question} ? </strong> </p>

                <div className={get_choice_class(question.choice1)} onClick={() => onChoice(question.choice1)}>
                    {question.choice1}
                </div>

                <div className={get_choice_class(question.choice2)} onClick={() => onChoice(question.choice2)}>
                    {question.choice2}
                </div>

                <div className={get_choice_class(question.choice3)} onClick={() => onChoice(question.choice3)}>
                    {question.choice3}
                </div>

                <div className={get_choice_class(question.choice4)} onClick={() => onChoice(question.choice4)}>
                    {question.choice4}
                </div>
            </div>
        </div>
    )
}