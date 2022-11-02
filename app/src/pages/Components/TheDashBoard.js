import Competitor from "./Competitor"

const TheDashBoard = ({ dashboard_users, current_user }) => {

return (
  <div className="dashboard_container">
  
    <h1 style={{textAlign:"center"}}>Top Competitors</h1>
  
    <table className="dashboard leaderboard">
    
      <thead>
        <tr>
          <th> Otaku </th>
          <th> Score </th>
          <th> Level </th>
          <th> Contributions </th>
          <th> Country </th>
        </tr>
      </thead>
      
      <tbody>  
        {dashboard_users?dashboard_users.map((competitor,index)=> (
          <Competitor
            key={index}
            index={index}
            current_user ={current_user ===competitor.id}
            name={competitor.username}
            points={competitor.points}
            level={competitor.level}
            contributions={competitor.n_contributions}
            country = {competitor.country}/>
            )):
          
          <Competitor
            name={"________"}
            points={"________"}
            level={"________"}
            contributions={"________"}
            country = {null}/>
        }

      </tbody>
    
    </table>
            
  </div> 
  )
}

export default TheDashBoard