import Interactions from "./components/Interactions"
import async_http_request from "./components/AsyncRequest"
import { useState, useEffect } from "react"
import { N_Game_Questions } from "Constants"

const UserProfile = ({ user_data }) => {

  const [games_score_percentage, setgames_score_percentage] = useState()
  const [user_interactions, setuser_interactions] = useState({})
  const [loading, setloading] = useState(true)

  useEffect(() => {

    async function get_user_interactions() {

      const interactions_result = await async_http_request({ path: "getprofile" })

      if (interactions_result === null) {
        return
      }

      const interactions_dict = {}
      let n_user_correct_answers = 0

      interactions_result.payload.interactions.forEach((n) => {

        if (n.anime.anime_name in interactions_dict) {
          n.correct_answer ? interactions_dict[n.anime.anime_name].correct += 1 : interactions_dict[n.anime.anime_name].not_correct += 1
        }

        else {
          interactions_dict[n.anime.anime_name] = {
            "correct": n.correct_answer ? 1 : 0,
            "not_correct": n.correct_answer ? 0 : 1
          }
        }

        if (n.correct_answer === true) {
          n_user_correct_answers += 1
        }

      })

      if (user_data.tests_started === 0) {
        setgames_score_percentage(0)
      }

      else {
        setgames_score_percentage(Math.round((n_user_correct_answers / (user_data.tests_started * N_Game_Questions)) * 100))
      }

      setuser_interactions(interactions_dict)
      setloading(false)
    }

    user_data && get_user_interactions()

    // eslint-disable-next-line
  }, [user_data])

  if (user_data && !loading) {
    return (
      <div className="account_container">
        <div className="flex_container">

          <div>
            <div className="progress">

              <div className="data_row">
                <div>Username</div>
                <div>{user_data.username}</div>
              </div>

              <div className="data_row">
                <div>Email</div>
                <div>{user_data.email}</div>
              </div>

              <div className="data_row">
                <div>Country</div>
                <div>
                  {user_data.country ?
                    <img src={`https://flagcdn.com/256x192/${user_data.country}.png`} width="30" height="20" alt="country_img"></img>
                    : "N/A"
                  }
                </div>
              </div>

              <div className="data_row">
                <div>Score</div>
                <div>{user_data.points}</div>
              </div>

              <div className="data_row">
                <div>Level</div>
                <div> {user_data.level}</div>
              </div>

              <div className="data_row">
                <div>Tests Score</div>
                <div>{games_score_percentage} %</div>
              </div>

              <div className="data_row">
                <div>Tests Started</div>
                <div>{user_data.tests_started}</div>
              </div>

              <div className="data_row">
                <div>Tests Completed</div>
                <div>{user_data.tests_completed}</div>
              </div>

            </div>
          </div>

          <Interactions interactions={user_interactions} />

        </div>
      </div>
    )
  }

  return (
    <div className="account_container">
      <div className="loading_div">
        loading ...
      </div>
    </div>
  )
}
export default UserProfile