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

  const [Question, setQuestion] = useState({
    question: "",
    rightanswer: "",
    choice1: "",
    choice2: "",
    choice3: "",
  })

  const question_ref = useRef(null)
  const submit_btn = useRef(null)
  const anime_select = useRef(null)

  // reject the following patterns
  
  // excluded symbols are # ` ~ @ ^ * | \
  // as they are rarely used in questions  
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

      if (submit_contribution.reviewer === true) {
        set_response_msg("Thanks for your Contribution !")
      }

      if (submit_contribution.reviewer === false) {
        set_response_msg("Thanks for your Contribution ! it will be reviewed soon")
      }

      // clear form after submission 
      setanime()
      for (const key in Question) {
        setQuestion(prev => ({ ...prev, [key]: "" }))
      }
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
    setanime(selected_anime)
    selected_anime && !Question.question && question_ref.current.focus()
    selected_anime && anime_select.current.blur()
  }

  useEffect(() => {

    if (sessionStorage.getItem("contribution") !== null) {
      setQuestion(JSON.parse(sessionStorage.getItem("contribution")))
    }

    if (sessionStorage.getItem("anime") !== null) {
      setanime(JSON.parse(sessionStorage.getItem("anime")))
    }

  }, [])


  useEffect(() => {

    sessionStorage.setItem("contribution", JSON.stringify(Question))
    !anime ? sessionStorage.setItem("anime", JSON.stringify("")) : sessionStorage.setItem("anime", JSON.stringify(anime))

  }, [Question, anime])

  return (
    <div className="centered_div contribution">

      <h1>Contribute a quesion</h1>

      <p>
        first make sure you have read
        <Link className="guidlines_link" to="/about" target={"_blank"} rel={"noreferrer"}>
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
            isClearable={true}
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