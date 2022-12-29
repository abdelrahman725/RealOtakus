import ReviewQuestion from "./Components/ReviewQuestion"
import async_http_request from "./Components/AsyncRequest"
import Select from 'react-select'
import { useState, useEffect, useRef, useContext } from "react"
import { GlobalStates } from "../App"
import { useLocation } from 'react-router-dom'

const QuestionsForReview = () => {

  const { set_info_message, SelectStyles } = useContext(GlobalStates)
  const [contributors_contributions, set_contributors_contributions] = useState()
  const [n_reviewed_contributions, set_n_reviewed_contributions] = useState()
  const [reviewstates, setreviewstates] = useState({})
  const [animes_options, setanimes_options] = useState([])
  const anime_select = useRef(null)
  const location = useLocation()
  const [selected_anime, setselected_anime] = useState()

  const handle_questions_filter = (selected) => {
    setselected_anime(selected)
    anime_select.current.blur()
  }
 
  const review_feedback_options = [
    { value: 1, label: 'not clear' },
    { value: 2, label: 'similar choices' },
    { value: 3, label: 'too easy' },
    { value: 4, label: 'wrong information' }
  ]

  useEffect(() => {
    let cancled = false

    setselected_anime(location.state)

    async function fetch_contributions() {
      const contributions_result = await async_http_request({ path: "get_review_contribution" })
      if (contributions_result === null) {
        set_info_message("network error")
        return
      }

      if (cancled === false) {

        const animes_set = new Set()

        contributions_result.questions.map((contribution) => animes_set.add(contribution.question.anime.anime_name))

        animes_set.forEach(anime => {
          setanimes_options(
            prev => [...prev, { value: anime, label: anime }]
          )
        })

        set_n_reviewed_contributions(contributions_result.n_reviewed_contributions)
        set_contributors_contributions(contributions_result.questions)
      }
    }

    fetch_contributions()

    return () => {
      setanimes_options([])
      cancled = true
    }

  }, [])


  return (
    <div className="review_page">

      <h2 className="title">
        <span>
          {contributors_contributions ?
            selected_anime ?
              contributors_contributions.filter(cont => selected_anime.value === cont.question.anime.anime_name).length
              :
              contributors_contributions.length
            :
            ""
          }
        </span>  Contributions to review
      </h2>
      <p> {n_reviewed_contributions} contributions have been reviewed</p>
      <br />

      <Select
        value={selected_anime}
        styles={SelectStyles}
        className="select_animes"
        placeholder="filter questions"
        isClearable={true}
        isLoading={!contributors_contributions}
        options={animes_options}
        onChange={handle_questions_filter}
        ref={anime_select}
      />

      <br />  <br />

      {contributors_contributions && contributors_contributions.map((cont, index) => (
        (selected_anime === null || selected_anime.value === cont.question.anime.anime_name) &&
        <ReviewQuestion
          setreviewstate={setreviewstates}
          reviewstate={reviewstates[cont.id] ? reviewstates[cont.id] : "pendingstate"}
          feedback_options = {review_feedback_options}
          set_n_reviewed_contributions={set_n_reviewed_contributions}
          anime={cont.question.anime.anime_name}
          id={cont.id}
          question={cont.question}
          date={cont.date_created}
          key={index}
        />

      ))}
    </div>
  )
}

export default QuestionsForReview