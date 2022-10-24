import Competitor from "./Competitor"
import { GlobalStates } from "../Home"
import { useEffect,useState,useContext } from "react"


const TheDashBoard = ({ dashboard_users, current_user }) => {

  //const {set_info_message} = useContext(GlobalStates)

return (
  <div className="dashboard_container">
  
    <h1 style={{textAlign:"center"}}>Top Competitors</h1>
  
    <table className="dashboard leaderboard">
    
      <thead>
        <tr>
          <th> name </th>
          <th> score </th>
          <th> level </th>
          <th> contributions </th>
          <th> country </th>
        </tr>
      </thead>
      
      <tbody>  

        {dashboard_users?dashboard_users.map((competitor,index)=> (
          
          <Competitor
            is_logged_in_user={current_user===competitor.id}
            key={index}
            index={index}
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