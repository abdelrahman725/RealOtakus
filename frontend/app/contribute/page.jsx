"use client";

import Link from 'next/link';
import Select from 'react-select'
import { ReactSelectStyles } from "@/components/utils/constants";
import { useState, useRef, useEffect } from "react"
import { toast } from 'react-toastify';
import ReAuthorizedApiRequest from "@/components/utils/generic_request";
import RequireAuthentication from "@/components/utils/requireauthentication";
import { useAuthContext } from '@/contexts/GlobalContext';

export default function Page() {
  const { IsAuthenticated, SetIsAuthenticated } = useAuthContext()
  const [all_animes, set_all_animes] = useState()
  const [anime, setanime] = useState()
  const [loading, setloading] = useState(false)
  const contribution_format = {
    question: "",
    rightanswer: "",
    choice1: "",
    choice2: "",
    choice3: "",
  }
  const [Question, setQuestion] = useState(contribution_format)

  const question_ref = useRef(null)
  const anime_select = useRef(null)

  // excluded symbols  # ` ~ @ ^ * | \  as they are rarely used in question-type text
  const required_pattern = /^[a-z0-9\s.,:;'"({\-/<>_=+!?%$&})]+$/i

  const fetch_all_animes = async () => {

    const result = await ReAuthorizedApiRequest({ path: "animes/" })

    if (result === null) {
      return
    }

    if (result.status_code === 401) {
      SetIsAuthenticated(false)
      return
    }

    set_all_animes(
      result.payload.map(anime => ({
        value: anime.id,
        label: anime.name
      }))
    )

  }

  const handle_short_question = (e) => {
    if (e.target.value.length < 7) {
      e.target.setCustomValidity("question must be at least 7 characters");
      return
    }
    e.target.setCustomValidity("");
  }

  const on_anime_select = (selected_anime) => {
    localStorage.setItem("anime", JSON.stringify(selected_anime))
    setanime(selected_anime)
    selected_anime && !Question.question && question_ref.current.focus()
    selected_anime && anime_select.current.blur()
  }

  const on_form_change = (e) => {
    const { name, value } = e.target

    if (name === "question") {
      question_ref.current.style.outlineColor = "#2684FF"
    }

    if (value !== '' && value.match(required_pattern) === null) {
      return
    }

    setQuestion(prev => ({ ...prev, [name]: value }))
    const previous_contribution_value = JSON.parse(localStorage.getItem("contribution"))
    previous_contribution_value[name] = value
    localStorage.setItem("contribution", JSON.stringify(previous_contribution_value))
  }

  const submit_contribution = async (cleaned_contribution) => {
    setloading(true)
    const result = await ReAuthorizedApiRequest({
      path: "contribute/",
      method: "POST",
      req_data: {
        "question": cleaned_contribution,
        "anime": anime.value
      }
    })
    setloading(false)

    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (result === null) {
      return
    }

    if (result.status_code === 201) {
      toast("😀 Thanks for your contribution!", { position: "top-center", toastId: "201" })

      // reset localstorage contribution
      localStorage.setItem("contribution", JSON.stringify(contribution_format))

      // clear form
      setQuestion({
        question: "",
        rightanswer: "",
        choice1: "",
        choice2: "",
        choice3: "",
      })

      document.activeElement.blur()
      return
    }

    if (result.status_code === 401) {
      SetIsAuthenticated(false)
      return
    }

    if (result.status_code === 409) {
      question_ref.current.style.outlineColor = "red"
      question_ref.current.focus()
      toast.warning("Question already exists", { position: "top-center", toastId: "409" })
      return
    }

    if (result.status_code === 410) {
      toast.warning("Anime is removed, please select another anime", { position: "top-center", toastId: "no_anime" })
      return
    }

    if (result.status_code === 429) {
      toast.warning("You've reached maximum number (10) of contributions for today", { position: "top-center", toastId: "429" })
      return
    }

    if (result.status_code === 400) {
      toast.error("invalid form inputs", { position: "top-center", toastId: "400" })
      return
    }
  }

  const validate_and_submit = (submit_event) => {
    submit_event.preventDefault()

    if (!anime) {
      anime_select.current.focus()
      return false
    }

    const cleaned_contribution = {
      question: "",
      rightanswer: "",
      choice1: "",
      choice2: "",
      choice3: "",
    }

    // remove leading and trailing spaces before checking for duplicates
    const unique_choices = new Set()
    for (const key in Question) {
      const trimmed_value = Question[key].trim()
      key !== "question" && unique_choices.add(trimmed_value)
      cleaned_contribution[key] = trimmed_value
    }

    if (unique_choices.size !== 4) {
      toast.warning("each choice must be unique !", { position: "top-center", toastId: "unique" })
      return
    }

    submit_contribution(cleaned_contribution)
  }

  useEffect(() => {
    if (IsAuthenticated) {

      fetch_all_animes()

      if (localStorage.getItem("contribution") !== null) {
        setQuestion(JSON.parse(localStorage.getItem("contribution")))
      }

      else {
        localStorage.setItem("contribution", JSON.stringify(contribution_format))
      }

      if (localStorage.getItem("anime") !== null) {
        setanime(JSON.parse(localStorage.getItem("anime")))
      }
    }
  }, [IsAuthenticated])

  return (
    <RequireAuthentication>
      <div className="contribute centered">
        <h1>Contribute a quesion</h1>
        <p>
          Frist make sure to read &nbsp;

          <Link className="simple_link" href="/about#contribution-guidelines" target="_blank" shallow>
            Contribution Guidelines
          </Link>
        </p>

        <form onSubmit={validate_and_submit}>

          <Select
            styles={ReactSelectStyles}
            className="react_select"
            placeholder="select anime"
            isLoading={!all_animes}
            options={all_animes}
            onChange={on_anime_select}
            value={anime}
            ref={anime_select}
          />

          <span className="info">new animes coming soon</span>

          <textarea name="question"
            typeof="text"
            placeholder="what is the question ?"
            cols={40} rows={3}
            maxLength={350}
            required
            value={Question.question}
            onChange={(e) => { on_form_change(e); handle_short_question(e) }}
            ref={question_ref}
          >
          </textarea>

          <textarea name="rightanswer"
            typeof="text"
            placeholder="right answer"
            cols={40} rows={3}
            maxLength={150}
            required
            value={Question.rightanswer}
            onChange={on_form_change}
          >
          </textarea>

          <h3>choices <span style={{ fontWeight: "lighter" }}>(wrong answers)</span> </h3>

          <textarea name="choice1"
            typeof="text"
            placeholder="choice 1"
            cols={40} rows={3}
            maxLength={150}
            required
            value={Question.choice1}
            onChange={on_form_change}
          >
          </textarea>

          <textarea name="choice2"
            typeof="text"
            placeholder="choice 2"
            cols={40} rows={3}
            maxLength={150}
            required
            value={Question.choice2}
            onChange={on_form_change}
          >
          </textarea>

          <textarea name="choice3"
            typeof="text"
            placeholder="choice 3"
            cols={40} rows={3}
            maxLength={150}
            required
            value={Question.choice3}
            onChange={on_form_change}
          >
          </textarea>

          <div className="submit_container">
            {!loading ? <button type="submit" className="submit_btn"> submit question</button> : "loading"}
          </div>

        </form>

      </div>
    </RequireAuthentication>
  )
}
