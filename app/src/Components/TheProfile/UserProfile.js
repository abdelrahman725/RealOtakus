import Interactions from './Interactions'
import { useState, useEffect } from "react"
import async_http_request from '../AsyncRequest'

export const UserProfile = () => {
  
  const [user_data,set_user_data] = useState([])
  const [user_interactions,setuser_interactions] = useState([])
  const [profile_is_loading,setprofile_is_loading]= useState(true)

  const getProfileData = async()=>{

    const profile_data  = await async_http_request({path:"profile"})
    set_user_data(profile_data.user_data)
    setuser_interactions(profile_data.user_interactions)
    setprofile_is_loading(false)
  }

  useEffect(()=>{ getProfileData() },[])

  return (
    <div className="userprofile">

    {!profile_is_loading ?
      <div>

      <Interactions interactions={user_interactions} />
        
      </div>
     :

      <strong>loading</strong>
    }
    
    </div>
  )
}
