import ContributedQuestion from "./Components/ContributedQuestion"
import async_http_request from "./Components/AsyncRequest"
import { useState, useEffect } from "react"

const UserContributions = () => {

  const [contributions, setcontributions] = useState()
  const [n_contributions, set_n_contributions] = useState()
  const [selected_contribution_state, set_selected_contribution_state] = useState(1)

  const filter_by_state = (selected_state) => {

    set_selected_contribution_state(selected_state)

    if (selected_state === 1) {
      set_n_contributions(contributions.length)
    }

    else {
      set_n_contributions(contributions.filter(c => c.approved === selected_state).length)
    }
  }


  useEffect(() => {

    async function get_contributions() {

      const fetched_contributions = await async_http_request({ path: "get_make_contribution" })
      if (contributions === null)
        return

      setcontributions(fetched_contributions)
      set_n_contributions(fetched_contributions.length)
    }

    get_contributions()

  }, [])

  return (

    <div className="user_contributions">

      {contributions ?
        contributions.length > 0 ?

          <div>

            <div className="contributions_states_buttons">

              <button className={selected_contribution_state === 1 ? "clicked_all" : "all"}
                onClick={() => filter_by_state(1)}>
                All
              </button>

              <button className={selected_contribution_state === true ? "clicked_approved" : "approved"}
                onClick={() => filter_by_state(true)}>
                approved
              </button>

              <button className={selected_contribution_state === null ? "clicked_pending" : "pending"}
                onClick={() => filter_by_state(null)}>
                pending
              </button>

              <button className={selected_contribution_state === false ? "clicked_rejected" : "rejected"}
                onClick={() => filter_by_state(false)}>
                rejected
              </button>

            </div>

            <h2>
              {n_contributions}  Contributions
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
          <div className="loading_div">no contributions </div>

        : <div className="loading_div">loading...</div>
      }

    </div>
  )
}

export default UserContributions