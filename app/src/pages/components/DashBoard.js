import Competitor from "./Competitor"
import { COUNTRIES_DICT } from "Constants"
import { useState } from "react"

const DashBoard = ({ leaderboard, current_user, authenticated }) => {

  const [showall_dashboard, set_showall_dashboard] = useState(false)

  return (
    <div className="dashboard_container">

      <h1 className="leaderboard_title">Top Otakus</h1>
      {leaderboard.length > 0 ?
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
      }

    </div>
  )
}

export default DashBoard