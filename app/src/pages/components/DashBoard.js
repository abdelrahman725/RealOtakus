import Competitor from "./Competitor"
import { COUNTRIES_DICT } from "Constants"
import { useState } from "react"

const DashBoard = ({ dashboard_users, current_user, authenticated }) => {

  const [show_all_dashboard, set_show_all_dashboard] = useState(false)

  return (
    <div className="dashboard_container">

      <h1 className="leaderboard_title">Top Otakus</h1>

      {dashboard_users.length > 0 ?
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
              {dashboard_users.map((competitor, index) => (
                (index < 10 ? true : show_all_dashboard) &&
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

          {dashboard_users.length > 10 &&
            <p className="simple_link" onClick={() => set_show_all_dashboard(!show_all_dashboard)}>
              {!show_all_dashboard ? "show all Leaderboard" : "show less"}
            </p>}
        </div>
        :
        <p>no data yet</p>
      }


    </div>
  )
}

export default DashBoard