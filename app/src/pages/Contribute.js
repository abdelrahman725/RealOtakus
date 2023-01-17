import async_http_request from "./Components/AsyncRequest"
import Select from 'react-select'
import { useState, useRef, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { GlobalStates } from "../App"

const Contribute = ({ all_animes_options }) => {

  const { SelectStyles } = useContext(GlobalStates)
  const [anime, setanime] = useState()
  const [response_msg, set_response_msg] = useState()
  const [question_info, set_question_info] = useState()
  const [choices_info, set_choices_info] = useState()
  const [submitted, setsubmitted] = useState(false)

  const question_format = {
    question: "",
    rightanswer: "",
    choice1: "",
    choice2: "",
    choice3: "",
  }

  const [Question, setQuestion] = useState(question_format)

  const question_ref = useRef(null)
  const submit_btn = useRef(null)
  const anime_select = useRef(null)


  // reject the following patterns

  // excluded symbols:  # ` ~ @ ^ * | \  as they are rarely used in questions  
  const excluded_symbols = /[#`~@^*|\\]/
  const extra_space = /\s{2,}/


  const handle_form_change = (e) => {

    const { name, value } = e.target

    if (name === "question") {
      question_ref.current.style.outlineColor = "#2684FF"
    }

    if (value.match(extra_space) != null || value.match(excluded_symbols) != null) {
      return
    }

    setQuestion(prev => ({ ...prev, [name]: value }))
    const updated_question = JSON.parse(sessionStorage.getItem("contribution"))
    updated_question[name] = value
    sessionStorage.setItem("contribution", JSON.stringify(updated_question))
  }

  const handle_form_submission = (e) => {

    e.preventDefault()

    const submit_contribution = async (cleaned_question) => {

      setsubmitted(true)

      const submit_contribution = await async_http_request({
        path: "get_make_contribution",
        method: "POST",
        data: {
          "question": cleaned_question,
          "anime": anime.value
        }
      })

      if (submit_contribution === null)
        return

      console.log(submit_contribution)

      setsubmitted(false)

      window.scrollTo({ top: 0, behavior: 'smooth' })

      if (submit_contribution.info === "conflict") {
        question_ref.current.style.outlineColor = "red"
        question_ref.current.focus()
        set_question_info("Sorry, This question already exists")
        return
      }

      sessionStorage.setItem("contribution", JSON.stringify(question_format))

      for (const key in Question) {
        setQuestion(prev => ({ ...prev, [key]: "" }))
      }

      set_response_msg("Thanks for your Contribution !")
    }

    const validate_contribution_form_then_submit = () => {

      if (!anime) {
        anime_select.current.focus()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return false
      }

      const cleaned_question = {
        question: "",
        rightanswer: "",
        choice1: "",
        choice2: "",
        choice3: "",
      }

      // removes leading and trailing spaces (to check for duplicates)
      const unique_choices = new Set()
      for (const key in Question) {
        const trimmed_value = Question[key].trim()
        key !== "question" && unique_choices.add(trimmed_value)
        cleaned_question[key] = trimmed_value
      }

      if (cleaned_question.question.length < 7) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        set_question_info("question must be at least 7 characters length")
        question_ref.current.focus()
        return false
      }

      if (unique_choices.size !== 4) {
        set_choices_info("each choice must be unique !")
        return
      }
      set_response_msg()
      submit_contribution(cleaned_question)
      document.activeElement.blur()
      set_choices_info()
      set_question_info()
    }

    validate_contribution_form_then_submit()
  }

  const on_anime_select = (selected_anime) => {
    sessionStorage.setItem("anime", JSON.stringify(selected_anime))
    setanime(selected_anime)
    selected_anime && !Question.question && question_ref.current.focus()
    selected_anime && anime_select.current.blur()
  }

  useEffect(() => {

    if (sessionStorage.getItem("contribution") !== null) {
      setQuestion(JSON.parse(sessionStorage.getItem("contribution")))
    }

    else {
      sessionStorage.setItem("contribution", JSON.stringify(question_format))
    }

    if (sessionStorage.getItem("anime") !== null) {
      setanime(JSON.parse(sessionStorage.getItem("anime")))
    }

  }, [])


  return (
    <div className="centered_div contribution">

      <h1>Contribute a quesion</h1>

      <p>
        make sure to read &nbsp;
        <Link className="simple_link" to="/about" target={"_blank"} rel={"noreferrer"}>
          Contribution Guidlines
        </Link>
      </p>

      <br />

      {response_msg && <h3>{response_msg}</h3>}

      <form onSubmit={handle_form_submission} >

        <div className="contribution_form">

          <Select
            styles={SelectStyles}
            className="react_select"
            placeholder="select anime"
            isLoading={!all_animes_options}
            options={all_animes_options}
            onChange={on_anime_select}
            value={anime}
            ref={anime_select}
          />

          <br />

          <div className="invalid_input">{question_info}</div>

          <textarea name="question"
            typeof="text"
            placeholder="what is the question ?"
            cols="40" rows="3"
            maxLength="350"
            required
            value={Question.question}
            onChange={handle_form_change}
            ref={question_ref}
          >
          </textarea><br />

          <textarea name="rightanswer"
            typeof="text"
            placeholder="right answer"
            cols="40" rows="3"
            maxLength="150"
            required
            value={Question.rightanswer}
            onChange={handle_form_change}
          >
          </textarea><br />

          <h3>choices <span style={{ fontWeight: "lighter" }}>(wrong answers)</span> </h3>

          <div className="invalid_input">{choices_info}</div>

          <textarea name="choice1"
            typeof="text"
            placeholder="choice 1"
            cols="40" rows="3"
            maxLength="150"
            required
            value={Question.choice1}
            onChange={handle_form_change}
          >
          </textarea><br />

          <textarea name="choice2"
            typeof="text"
            placeholder="choice 2"
            cols="40" rows="3"
            maxLength="150"
            required
            value={Question.choice2}
            onChange={handle_form_change}
          >
          </textarea><br />

          <textarea name="choice3"
            typeof="text"
            placeholder="choice 3"
            cols="40" rows="3"
            maxLength="150"
            required
            value={Question.choice3}
            onChange={handle_form_change}
          >
          </textarea><br />

          <div className="submit_container">
            {!submitted ? <button type="submit" className="submit_btn" ref={submit_btn}> submit question</button> : "loading..."}
          </div>

        </div>

      </form>

    </div>
  )
}

export default Contribute