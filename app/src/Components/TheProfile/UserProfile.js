import Interactions from './Interactions'
import { useState, useEffect } from "react"
import async_http_request from '../AsyncRequest'
import { FcOk } from 'react-icons/fc' 
export const UserProfile = ({is_reviewer}) => {
  
  const [user_data,set_user_data] = useState()
  const [user_interactions,setuser_interactions] = useState([])

  useEffect(()=>{

    async function getProfileData(){

      const profile_result  = await async_http_request({path:"profile"})
      if (profile_result===null){
        return
      }
      console.log(profile_result.user_data)
      set_user_data(profile_result.user_data)
      setuser_interactions(profile_result.user_interactions)
    }
    getProfileData() 
  
  },[])

  return (
    <div className="account">

      {user_data ?
        <div>
          <div className="profile">
            <div>
              Tests started <p>{user_data.tests_started}</p>
            </div>
            
            <hr />
            
            <div>
              Tests completed
              <p> {user_data.tests_completed}</p>
            </div>
            
            <hr />
           
            <div>
              <FcOk/> Contributions <p> {user_data.n_approved_contributions}</p>
            </div>
            {is_reviewer && <hr /> }
            {is_reviewer &&
            <div>
              Contributions reviewed
              <p>{user_data.n_questions_reviewed}</p>
            </div>
            }
          
          </div>
          <br />
          { user_interactions.length > 0 &&  <Interactions interactions={user_interactions} />  } 
        </div>

        :
        <strong>loading</strong> 
      }
    
    </div>
  )
}
