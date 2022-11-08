import async_http_request from "./Components/AsyncRequest"
import { useState, useEffect, useContext } from "react"
import Interactions from "./Components/Interactions"
import { GlobalStates } from "../App"
import { FcOk } from 'react-icons/fc' 

const UserProfile = ({is_reviewer}) => {

  const { N_Game_Questions } = useContext(GlobalStates)
  const [user_data,set_user_data] = useState()
  const [games_score_percentage,setgames_score_percentage]  = useState()
  const [user_interactions, setuser_interactions] = useState({})

  useEffect(()=>{

    async function getProfileData(){

      const profile_result  = await async_http_request({path:"getprofile"})
      if (profile_result===null){
        return
      }
      
      const interactions_dict = {}

      let n_user_correct_answers =  0
      profile_result.interactions.map((n)=>{
        if (n.anime.anime_name in interactions_dict){
          n.correct_answer ? interactions_dict[n.anime.anime_name].correct +=1 : interactions_dict[n.anime.anime_name].not_correct+=1
        }
        
        else{
          interactions_dict[n.anime.anime_name] = {
            "correct" : n.correct_answer ? 1 :0,
            "not_correct" :n.correct_answer ? 0 :1 
          }
        }
        
        if (n.correct_answer === true)
          n_user_correct_answers +=1
      })


      if (profile_result.user_data.tests_completed === 0){
        setgames_score_percentage(0)
      }
      else{
        setgames_score_percentage( Math.round( (n_user_correct_answers / (profile_result.user_data.tests_completed * N_Game_Questions) ) *100))
      }

      setuser_interactions(interactions_dict)
      set_user_data(profile_result.user_data)
    }

    getProfileData() 
  
  },[])

  return (
    <div className="account_container">
      {user_data ?
        <div className="account">
          
          <div>
            <h2>Progress</h2>
            
            <div className="progress"> 
                <div>
                  <span>Score</span> <p> {user_data.points} </p>
                </div>
                
                <div>
                  <span>Tests Score </span><p> {games_score_percentage } %</p>
                </div>
                
                <div>
                <span>Tests completed</span> <p> {user_data.tests_completed}</p>
                </div>
                          
                <div>
                  <span>Contributions</span> <FcOk/>  <p> {user_data.n_approved_contributions}</p>
                </div>

                {is_reviewer && <div><span> Contributions reviewed </span> <p>{user_data.n_questions_reviewed}</p></div>}          
            </div>
          
          </div>

          <Interactions interactions={user_interactions} /> 
        
        </div>
        :
        <strong>loading</strong> 
      }
    
    </div>
  )
}
export default UserProfile