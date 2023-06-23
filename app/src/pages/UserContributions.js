import ContributedQuestion from "./components/ContributedQuestion"
import async_http_request from "./components/AsyncRequest"
import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom'

const UserContributions = () => {

  const [contributions, setcontributions] = useState()
  const [filtered_contributions, set_filtered_contributions] = useState()

  // contributions are filtered by :
  // 1- contribution state
  // 2- anime (not used yet)
  const [selected_contribution_state, set_selected_contribution_state] = useState("all")
  //const [anime, set_anime] = useState("all")

  const location = useLocation()

  const contribution_state_to_label = {
    "all": "total",
    true: "approved",
    false: "rejected",
    null: "pending",
  }

  const feedback_value_to_label = {
    "irr": "not relevant",
    "dup": "duplicate",
    "eas": "too easy",
    "bad": "bad choices",
    "inv": "invalid/wrong information"
  }

  useEffect(() => {

    if (contributions) {
      set_filtered_contributions(contributions.filter(c => selected_contribution_state === "all" ? true : c.approved === selected_contribution_state))

    }

  }, [selected_contribution_state, contributions])

  useEffect(() => {

    async function get_contributions() {

      const fetched_contributions = await async_http_request({ path: "get_make_contribution" })
      if (contributions === null)
        return

      setcontributions(fetched_contributions.payload)
      location.state !== null && set_selected_contribution_state(location.state)
    }
    get_contributions()
    // eslint-disable-next-line
  }, [])

  return (

    <div className="user_contributions">

      {contributions ?
        contributions.length > 0 ?

          <div>

            <div className="contributions_states_buttons">

              <button className={`all darker_on_hover ${selected_contribution_state === "all" && "darker_background"}`}
                onClick={() => set_selected_contribution_state("all")}>
                All
              </button>

              <button className={`pending darker_on_hover ${selected_contribution_state === null && "darker_background"}`}
                onClick={() => set_selected_contribution_state(null)}>
                pending
              </button>

              <button className={`approved darker_on_hover ${selected_contribution_state === true && "darker_background"}`}
                onClick={() => set_selected_contribution_state(true)}>
                approved
              </button>

              <button className={`rejected darker_on_hover ${selected_contribution_state === false && "darker_background"}`}
                onClick={() => set_selected_contribution_state(false)}>
                rejected
              </button>

            </div>

            <h2>
              <span className="n_contributions">
                {filtered_contributions && filtered_contributions.length}
              </span> {contribution_state_to_label[selected_contribution_state]} Contributions
            </h2>

            <div className="questions_container">
              {filtered_contributions && filtered_contributions.map((contribution, index) => (
                <ContributedQuestion key={index} contribution={contribution} feedback_value_to_label={feedback_value_to_label} />
              ))}
            </div>

          </div>
          :
          <div>no contributions yet</div>
        : <div>loading</div>
      }

    </div>
  )
}

export default UserContributions