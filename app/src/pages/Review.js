import ReviewQuestion from "./Components/ReviewQuestion"
import async_http_request from "./Components/AsyncRequest"
import Select from 'react-select'
import { useState, useEffect, useRef, useContext } from "react"
import { GlobalStates } from "../App"
import { useLocation, Link } from 'react-router-dom'

const Review = () => {

  const { SelectStyles } = useContext(GlobalStates)
  const [contributors_contributions, set_contributors_contributions] = useState()
  const [animes, set_animes] = useState()
  const [animes_options, setanimes_options] = useState([{ value: "all", label: "All" }])
  const [selected_anime, setselected_anime] = useState()
  const [result_msg, set_result_msg] = useState("loading contributions...")
  const location = useLocation()
  const anime_select = useRef(null)

  const handle_questions_filter = (selected) => {
    setselected_anime(selected)
    anime_select.current.blur()
  }

  const review_feedback_options = [
    { value: 1, label: 'not relevant' },
    { value: 3, label: 'too easy' },
    { value: 2, label: 'bad choices' },
    { value: 4, label: 'invalid/wrong information'}
  ]

  const contributions_states_classes = {
    null: "pendingstate",
    false: "declinestate",
    true: "approvestate"
  }

  const filter_questions = (anime) => {
    if (selected_anime) {

      if (selected_anime.value === "all")
        return true

      return selected_anime.value === anime
    }
    return true
  }

  useEffect(() => {
    let cancled = false

    location.state && setselected_anime(location.state)

    async function fetch_contributions() {

      const contributions_result = await async_http_request({ path: "get_review_contribution" })

      if (contributions_result === null) {
        set_result_msg("network error")
        return
      }

      if (contributions_result.status === 401) {
        set_result_msg("you must be a reviewer first to review contributions")
        return
      }

      if (cancled === false) {

        set_animes(contributions_result.payload.animes)

        contributions_result.payload.animes.forEach((each_anime) => (
          setanimes_options(
            prev => [...prev, { value: each_anime.anime_name, label: each_anime.anime_name }]
          )
        ))

        set_contributors_contributions(contributions_result.payload.questions)
        set_result_msg()

      }

    }

    fetch_contributions()

    return () => {
      setanimes_options([{ value: "all", label: "All" }])
      cancled = true
    }

  }, [])


  return (
    <div className="review_page">

      {contributors_contributions &&
        <div className="review_container">

          <div className="animes_for_review">

            <p><strong>{animes.reduce((total, cur_anime) => total + cur_anime.reviewed_contributions, 0)}</strong> contributions Reviewed</p>

            <table className="dashboard">
              <thead>
                <tr>
                  <th> anime</ th>
                  <th> Contributions reviewed </th>
                </tr>
              </thead>

              <tbody>
                {animes.map((anime, index) => (
                  <tr key={index}>
                    <td>{anime.anime_name}</td>
                    <td>{anime.reviewed_contributions}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          <div className="contributions_for_review">

            <p>
              <strong>
                {selected_anime ?
                  contributors_contributions.filter(cont => cont.approved === null && (selected_anime.value === cont.question.anime.anime_name || selected_anime.value === "all")).length
                  :
                  contributors_contributions.filter(cont => cont.approved === null).length
                }
              </strong>  contributions need review
            </p>

            <Select
              isDisabled={contributors_contributions.length === 0}
              value={selected_anime}
              styles={SelectStyles}
              className="react_select"
              placeholder={`filter ${animes_options.length - 1} animes`}
              options={animes_options}
              onChange={handle_questions_filter}
              ref={anime_select}
            />

            <p className="link_to_about_page">
              make sure to read&nbsp;
              <Link className="simple_link" to="/about" target={"_blank"} rel={"noreferrer"}>
                Review Guidlines
              </Link>
            </p>

            {contributors_contributions.map((each_contribution) => (
              (filter_questions(each_contribution.question.anime.anime_name)) &&
              <ReviewQuestion
                key={each_contribution.id}
                contribution_object={each_contribution}
                set_animes={set_animes}
                set_contributors_contributions={set_contributors_contributions}
                contribution_class={contributions_states_classes[each_contribution.approved]}
                feedback_options={review_feedback_options}
              />
            ))}

          </div>

        </div>
      }

      {result_msg && <div className="loading_div">{result_msg}</div>}

    </div>
  )
}

export default Review