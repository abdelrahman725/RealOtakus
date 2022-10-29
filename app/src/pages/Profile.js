import async_http_request from "./Components/AsyncRequest"
import { useState, useEffect, useContext } from "react"
import Interactions from "./Components/Interactions"
import { GlobalStates } from "../App"
import { FcOk } from 'react-icons/fc' 

const UserProfile = ({is_reviewer}) => {
  
  const { N_Game_Questions } = useContext(GlobalStates)
  const [user_data,set_user_data] = useState()
  const [games_score_percentage,setgames_score_percentage]  = useState()
  const [user_interactions,setuser_interactions] = useState([])

  useEffect(()=>{

    async function getProfileData(){

      const profile_result  = await async_http_request({path:"getprofile"})
      if (profile_result===null){
        return
      }
      
      //console.log(profile_result.user_data)
      
      if (profile_result.user_data.tests_completed===0){
        setgames_score_percentage(0)
      }

      else{
        const user_right_answers = profile_result.user_interactions.reduce( (prev, interaction) => prev + interaction.right_answers, 0)
        setgames_score_percentage(Math.round( (user_right_answers / (profile_result.user_data.tests_completed * N_Game_Questions) ) *100))
      }

      set_user_data(profile_result.user_data)
      setuser_interactions(profile_result.user_interactions)
    }

    getProfileData() 
  
  },[])

  return (
    <div className="account">

      {user_data ?
        <div>
          <h2>achievements</h2>
          
          <div className="achievments">
          
            <div>
              Quizes Score <p> {games_score_percentage } %</p>
            </div>
            
            <hr />
            
            <div>
              Tests completed <p> {user_data.tests_completed}</p>
            </div>
            
            <hr />
           
            <div>
              <FcOk/> Contributions <p> {user_data.n_approved_contributions}</p>
            </div>

            {is_reviewer && <hr /> }
            {is_reviewer && <div> Contributions reviewed <p>{user_data.n_questions_reviewed}</p></div>}          
          
          </div>

          { user_interactions.length > 0 &&  <Interactions interactions={user_interactions} />  } 
        
        </div>

        :
        <strong>loading</strong> 
      }
    
    </div>
  )
}
export default UserProfile