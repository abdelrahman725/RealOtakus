import Competitor from "./Competitor"

const DashBoard = ({ dashboard_users, current_user }) => {

  return (
    <div className="dashboard_container">

      <h1 className="leaderboard_title">Top Otakus</h1>

      {dashboard_users.length > 0 ?
        <table className="dashboard leaderboard">

          <thead>
            <tr>
              <th className="user_order_head"></th>
              <th> Otaku </th>
              <th> Score </th>
              <th> Level </th>
              <th> Contributions </th>
              <th> Country </th>
            </tr>
          </thead>

          <tbody>
            {dashboard_users.map((competitor, index) => (
              <Competitor
                key={index}
                index={index}
                current_user={current_user && current_user.id === competitor.id}
                name={competitor.username}
                points={competitor.points}
                level={competitor.level}
                contributions={competitor.n_contributions}
                country={competitor.country} />
            ))
            }

          </tbody>

        </table> :

        <p>no data yet</p>
      }


    </div>
  )
}

export default DashBoard