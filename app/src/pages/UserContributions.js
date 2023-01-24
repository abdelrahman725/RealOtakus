import ContributedQuestion from "./Components/ContributedQuestion"
import async_http_request from "./Components/AsyncRequest"
import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'

const UserContributions = () => {

  const [contributions, setcontributions] = useState()
  const [n_contributions, set_n_contributions] = useState()
  const [selected_contribution_state, set_selected_contribution_state] = useState(1)
  const location = useLocation()

  useEffect(() => {

    if (contributions) {

      if (selected_contribution_state === 1) {
        set_n_contributions(contributions.length)
      }

      else {
        set_n_contributions(contributions.filter(c => c.approved === selected_contribution_state).length)
      }
    }

  }, [selected_contribution_state])

  useEffect(() => {

    async function get_contributions() {

      const fetched_contributions = await async_http_request({ path: "get_make_contribution" })
      if (contributions === null)
        return

      setcontributions(fetched_contributions.payload)
      location.state !== null ? set_selected_contribution_state(location.state) : set_n_contributions(fetched_contributions.payload.length)

    }

    get_contributions()

  }, [])

  return (

    <div className="user_contributions">

      {contributions ?
        contributions.length > 0 ?

          <div>

            <div className="contributions_states_buttons">

              <button className={`all darker_on_hover ${selected_contribution_state === 1 && "darker_background"}`}
                onClick={() => set_selected_contribution_state(1)}>
                All
              </button>

              <button className={`approved darker_on_hover ${selected_contribution_state === true && "darker_background"}`}
                onClick={() => set_selected_contribution_state(true)}>
                approved
              </button>

              <button className={`pending darker_on_hover ${selected_contribution_state === null && "darker_background"}`}
                onClick={() => set_selected_contribution_state(null)}>
                pending
              </button>

              <button className={`rejected darker_on_hover ${selected_contribution_state === false && "darker_background"}`}
                onClick={() => set_selected_contribution_state(false)}>
                rejected
              </button>

            </div>

            <h2>
              <span className="n_contributions">{n_contributions}</span>
              {selected_contribution_state === 1 && " total "}
              {selected_contribution_state === true && " approved "}
              {selected_contribution_state === false && " rejected "}
              {selected_contribution_state === null && " pending "}
              Contributions
            </h2>

            <div className="questions_container">
              {contributions.map((contribution, index) => (
                (selected_contribution_state === 1 || selected_contribution_state === contribution.approved)
                &&
                <ContributedQuestion key={index} contribution={contribution} />
              ))}
            </div>

          </div>
          :
          <div className="loading_div">no contributions yet</div>

        : <div className="loading_div">loading...</div>
      }

    </div>
  )
}

export default UserContributions