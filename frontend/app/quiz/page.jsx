"use client";

import RequireAuthentication from "@/components/utils/requireauthentication";
import QuizResult from "@/components/quiz_results";
import Question from "@/components/question";
import Select from 'react-select'
import Link from "next/link";
import ReAuthorizedApiRequest from "@/components/utils/generic_request";
import { toast } from "react-toastify"
import { ReactSelectStyles, N_Quiz_Questions } from "@/components/utils/constants";
import { useState, useEffect, useRef } from 'react'
import { useGlobalContext } from "@/contexts/GlobalContext";
import { useAuthContext } from "@/contexts/GlobalContext";
import { FaArrowRight } from "react-icons/fa"

export default function Page() {
  const { IsAuthenticated, SetIsAuthenticated } = useAuthContext()
  const { QuizStarted, SetQuizStarted } = useGlobalContext()
  const [timeout, settimout] = useState(false)
  const [animesoptions, setanimesoptions] = useState()
  const [questions, setquestions] = useState()
  const [selected_anime, setselected_anime] = useState()
  const [quizresults, setquizresults] = useState()
  const [useranswers, setuseranswers] = useState({})
  const [quiz_score, setquiz_score] = useState()
  const [index, setindex] = useState(0)
  const [loading, set_loading] = useState(false)
  const anime_select = useRef(null)

  const fetch_quiz_animes = async () => {

    const result = await ReAuthorizedApiRequest({ path: "quiz/animes/" })

    if (result === null) {
      return
    }

    if (result.status_code === 401) {
      SetIsAuthenticated(false)
      return
    }

    setanimesoptions(
      result.payload.map(anime => ({
        value: anime.id,
        label: anime.name,
        user_interactions: anime.n_user_interactions,
        anime_questions: anime.n_active_questions
      }))
    )
  }

  const get_quiz = async () => {

    setquiz_score()
    settimout(false)
    setindex(0)
    setquestions()
    setquizresults()
    setuseranswers({})

    set_loading(true)
    const result = await ReAuthorizedApiRequest({ path: `quiz/get/${selected_anime.value}` })
    set_loading(false)

    if (result === null) {
      return
    }

    if (result.status_code === 200) {
      setquestions(result.payload.questions)
      SetQuizStarted(true)
      setselected_anime()
      return
    }

    if (result.status_code === 401) {
      SetIsAuthenticated(false)
      return
    }

    if (result.status_code === 404) {
      toast.info("no enough questions for selected anime", { position: "top-center", toastId: "no_quiz" })
      return
    }

    if (result.status_code === 410) {
      toast.warning("Anime is removed, please select another anime", { position: "top-center", toastId: "no_anime" })
      return
    }

    toast.error("an error occurred", { position: "top-center", toastId: "err" })
  }

  const submit_quiz = async () => {

    settimout(true)
    set_loading(true)

    const result = await ReAuthorizedApiRequest({
      path: `quiz/submit/`,
      method: "POST",
      req_data: { "answers": useranswers }
    })

    set_loading(false)

    if (result === null) {
      return
    }

    if (result.status_code === 401) {
      SetIsAuthenticated(false)
      return
    }

    const answers = {}
    let score = 0

    result.payload.answers.forEach((question) => ((
      answers[question.id] = question.right_answer,
      question.right_answer === useranswers[question.id] && (score += 1)
    )))

    SetQuizStarted(false)
    setquiz_score(score)
    setquizresults(answers)
  }

  const on_choice_select = (id, each_new_answer) => {
    const new_answers = useranswers
    new_answers[id] = each_new_answer
    setuseranswers(new_answers)
  }

  const hide_anime = (n_interactions, anime_active_questions) => {
    if ((anime_active_questions - n_interactions) >= N_Quiz_Questions) {
      return false
    }
    return true
  }

  const on_anime_select = (selected) => {
    setselected_anime(selected)
    anime_select.current.blur()
  }

  const nextquestion = () => setindex(prev => prev + 1)

  useEffect(() => {
    IsAuthenticated && fetch_quiz_animes()

    return () => {
      SetQuizStarted(null)
    }
  }, [IsAuthenticated])


  useEffect(() => {
    if (QuizStarted && questions) {
      window.onbeforeunload = () => { return true }
      document.onvisibilitychange = () => {
        if (document.visibilityState === "hidden") {
          toast.warning("Sorry your quiz is canceled because you left the page", { position: "top-center" })
          SetQuizStarted(null)
        }
      }
    }

    return () => {
      document.onvisibilitychange = null
      window.onbeforeunload = null
    }

  }, [QuizStarted, questions])

  return (
    <RequireAuthentication>
      <div className="quiz_page centered">
        {QuizStarted === null &&
          <div className="pre_quiz">
            <h1>Otakus Quiz</h1>
            <div className="container">
              <div className="about_quiz">
                <h2>About Quiz</h2>
                <p>- The Quiz contains <strong>{N_Quiz_Questions}</strong> multiple choice questions.</p>
                <p>- You have <strong>1</strong>  min for each question.</p>
                <p>- Make sure you have a stable internet connection, Good luck!</p>
                <p>- <Link className="simple_link" href="/about#choosing-animes" target={"_blank"} shallow>How available quiz animes get selected ?</Link>
                </p>
              </div>
              <div className="start">
                <Select
                  isDisabled={loading}
                  styles={ReactSelectStyles}
                  className="react_select"
                  placeholder="select anime"
                  value={selected_anime}
                  isClearable={true}
                  options={animesoptions}
                  isLoading={animesoptions ? false : true}
                  onChange={on_anime_select}
                  isOptionDisabled={(option) => hide_anime(option.user_interactions, option.anime_questions)}
                  ref={anime_select}
                />

                <div className="submit_container">
                  {!loading ?
                    <button className="submit_btn" onClick={() => selected_anime ? get_quiz() : anime_select.current.focus()} >
                      Start
                    </button> :
                    "loading quiz..."
                  }
                </div>
              </div>
            </div>
          </div>
        }

        {QuizStarted && questions &&
          <div className="quiz">
            <h3>⚠️ Do not leave current page</h3>

            <Question
              question={questions[index]}
              question_index={index}
              onselect={on_choice_select}
              nextquestion={nextquestion}
              timeout={timeout}
              settimout={settimout}
            />

            <div className="quiz_btns">
              {index === N_Quiz_Questions - 1 ?
                !loading ? <button onClick={submit_quiz} className="submit_btn"> Submit </button> : "fetching results..."
                :
                <button onClick={nextquestion} className="next_btn">
                  <span>next</span><FaArrowRight className="icon" />
                </button>
              }
            </div>
          </div>
        }

        {QuizStarted === false && quizresults &&
          <QuizResult
            results={quizresults}
            useranswers={useranswers}
            questions={questions}
            score={quiz_score}
          />
        }
      </div>
    </RequireAuthentication >
  )
}
