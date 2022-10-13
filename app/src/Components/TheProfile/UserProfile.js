import Interactions from './Interactions'
import { useState, useEffect } from "react"
import async_http_request from '../AsyncRequest'

export const UserProfile = () => {
  
  const [user_data,set_user_data] = useState()
  const [user_interactions,setuser_interactions] = useState([])

  useEffect(()=>{

    async function getProfileData(){

      const profile_result  = await async_http_request({path:"profile"})
      if (profile_result===null){
        return
      }
      
      set_user_data(profile_result.user_data)
      setuser_interactions(profile_result.user_interactions)
    }
    getProfileData() 
  
  },[])

  return (
    <div className="centered_div userprofile">

    {user_data ?
      <div>
        
      <Interactions interactions={user_interactions} />
        
      </div>
      :
      
      <strong>loading</strong>
      
    }
    
    </div>
  )
}
