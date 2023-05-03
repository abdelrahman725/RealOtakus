import async_http_request from "./components/AsyncRequest"
import Select from 'react-select'
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { SelectStyles } from "Constants"

const Contribute = ({ all_animes_options }) => {

  const [anime, setanime] = useState()
  const [response_msg, set_response_msg] = useState()
  const [question_info, set_question_info] = useState()
  const [choices_info, set_choices_info] = useState()
  const [submitted, setsubmitted] = useState(false)

  const contribution_format = {
    question: "",
    rightanswer: "",
    choice1: "",
    choice2: "",
    choice3: "",
  }

  const [Question, setQuestion] = useState(contribution_format)

  const question_ref = useRef(null)
  const submit_btn = useRef(null)
  const anime_select = useRef(null)

  // excluded symbols  # ` ~ @ ^ * | \  as they are rarely used in question-type text
  
  const required_pattern = /^[a-z0-9\s.,:;'"({\-/<>_=+!?%$&})]+$/i

  const handle_form_change = (e) => {

    const { name, value } = e.target

    if (name === "question") {
      question_ref.current.style.outlineColor = "#2684FF"
    }
  
    if (value !== '' && value.match(required_pattern) === null) {
      return
    }

    setQuestion(prev => ({ ...prev, [name]: value }))
    const previous_contribution_value = JSON.parse(sessionStorage.getItem("contribution"))
    previous_contribution_value[name] = value
    sessionStorage.setItem("contribution", JSON.stringify(previous_contribution_value))
  }

  const handle_form_submission = (e) => {

    e.preventDefault()

    const submit_contribution = async (cleaned_contribution) => {

      setsubmitted(true)

      const submit_contribution_response = await async_http_request({
        path: "get_make_contribution",
        method: "POST",
        data: {
          "question": cleaned_contribution,
          "anime": anime.value
        }
      })

      if (submit_contribution_response === null)
        return


      setsubmitted(false)

      window.scrollTo({ top: 0, behavior: 'smooth' })

      if (submit_contribution_response.status === 409) {
        question_ref.current.style.outlineColor = "red"
        question_ref.current.focus()
        set_question_info("Sorry, This question already exists")
        return
      }

      if (submit_contribution_response.status === 403) {
        set_question_info("Max number (10) of contributions within the last 24 hrs reached")
        return
      }

      if (submit_contribution_response.status !== 201) {
        set_question_info("an error has occurred")
        return
      }
      // clear session storage and form
      sessionStorage.setItem("contribution", JSON.stringify(contribution_format))

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

      const cleaned_contribution = {
        question: "",
        rightanswer: "",
        choice1: "",
        choice2: "",
        choice3: "",
      }

      // removes leading and trailing spaces before checking for duplicates
      const unique_choices = new Set()
      for (const key in Question) {
        const trimmed_value = Question[key].trim()
        key !== "question" && unique_choices.add(trimmed_value)
        cleaned_contribution[key] = trimmed_value
      }

      if (cleaned_contribution.question.length < 7) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        set_question_info("question must be at least 7 characters")
        question_ref.current.style.outlineColor = "red"
        question_ref.current.focus()
        return false
      }

      if (unique_choices.size !== 4) {
        set_choices_info("each choice must be unique !")
        return
      }
      set_response_msg()
      submit_contribution(cleaned_contribution)
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
      sessionStorage.setItem("contribution", JSON.stringify(contribution_format))
    }

    if (sessionStorage.getItem("anime") !== null) {
      setanime(JSON.parse(sessionStorage.getItem("anime")))
    }

  }, [])


  return (
    <div className="centered_div contribution">

      <h1>Contribute a quesion</h1>

      <p>
        Frist make sure to read &nbsp;
        <Link className="simple_link" to="/about#contribution-guidelines" target={"_blank"} >
          Contribution Guidelines
        </Link>
      </p>

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

          <span>new animes coming soon</span>

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
          </textarea>

          <textarea name="rightanswer"
            typeof="text"
            placeholder="right answer"
            cols="40" rows="3"
            maxLength="150"
            required
            value={Question.rightanswer}
            onChange={handle_form_change}
          >
          </textarea>

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
          </textarea>

          <textarea name="choice2"
            typeof="text"
            placeholder="choice 2"
            cols="40" rows="3"
            maxLength="150"
            required
            value={Question.choice2}
            onChange={handle_form_change}
          >
          </textarea>


          <textarea name="choice3"
            typeof="text"
            placeholder="choice 3"
            cols="40" rows="3"
            maxLength="150"
            required
            value={Question.choice3}
            onChange={handle_form_change}
          >
          </textarea>

          <div className="submit_container">
            {!submitted ? <button type="submit" className="submit_btn" ref={submit_btn}> submit question</button> : "validating..."}
          </div>

        </div>

      </form>

    </div>
  )
}

export default Contribute