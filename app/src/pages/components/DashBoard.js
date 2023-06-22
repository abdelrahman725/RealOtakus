import Competitor from "./Competitor"
import { COUNTRIES_DICT } from "Constants"
import { useState, useEffect } from "react"
import async_http_request from "./AsyncRequest"

const DashBoard = ({ current_user, authenticated }) => {

  const [leaderboard, set_leaderboard] = useState()
  const [showall_dashboard, set_showall_dashboard] = useState(false)

  useEffect(() => {

    const fetch_leaderboard = async () => {
      const leaderboard_result = await async_http_request({ path: "leaderboard" })

      if (leaderboard_result === null)
        return

      set_leaderboard(leaderboard_result.payload.leaderboard)
    }

    fetch_leaderboard()

  }, [])

  return (
    <div className="dashboard_container">

      <h1 className="leaderboard_title">Top Otakus</h1>
      {leaderboard ?
        leaderboard.length > 0 ?
          <div>
            <table className="dashboard leaderboard">

              <thead>
                <tr>
                  <th className="user_order_head"></th>
                  <th> Otaku </th>
                  <th title="accumulated score from quizes and contributions"> Score </th>
                  <th> Level </th>
                  <th title="approved contributions"> Contributions </th>
                  <th> Country </th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((competitor, index) => (
                  (index < 10 ? true : showall_dashboard) &&
                  <Competitor
                    key={index}
                    index={index}
                    current_user={authenticated && current_user && current_user.id === competitor.id}
                    name={competitor.username}
                    points={competitor.points}
                    level={competitor.level}
                    contributions={competitor.n_contributions}
                    country_code={competitor.country}
                    country_name={COUNTRIES_DICT[competitor.country]}
                  />
                ))
                }

              </tbody>

            </table>

            {leaderboard.length > 10 &&
              <p className="simple_link" onClick={() => set_showall_dashboard(!showall_dashboard)}>
                {!showall_dashboard ? "show all Leaderboard" : "show less"}
              </p>}
          </div>
          :
          <p>no data yet</p>
        : <p>loading leaderboard</p>
      }

    </div>
  )
}

export default DashBoard