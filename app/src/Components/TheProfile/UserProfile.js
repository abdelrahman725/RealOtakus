import Contributions from './Contributions'
import QuestionsForReview from './QuestionsForReview'

import { ServerContext } from '../../App'
import { useContext, useState, useEffect } from "react"

export const UserProfile = () => {
  
  const {server} = useContext(ServerContext)
  const profile_url  = `${server}/home/profile`

  const[approvedcontributions,setapprovedcontributions]= useState([])
  const[pendingcontributions,setpendingcontributions]= useState([])
  const[questionsForReview,setquestionsForReview]= useState([])
  const[animesToReview,setanimesToReview] = useState([])

  const[loading,setloading]= useState(true)

  const getProfileData = async()=>
  {
    const res = await fetch(profile_url)
    const data  = await res.json()
      
    const anime_options = [{value:1,label:"all animes"}]
      
    const anime_names = new Set()
    data.questionsForReview.map((question ) => 
    anime_names.add(question.anime.anime_name)
    )

    Array.from(anime_names).map((a) => 
    anime_options.push({value:a,label:a})
    )
    
    data.UserContributions.map((q) =>  
    q.approved===true ?
    setapprovedcontributions(prev_approved => [...prev_approved,q]):  
    setpendingcontributions(prev_pending => [...prev_pending,q])
    )
      
    setanimesToReview(anime_options)
    setquestionsForReview(data.questionsForReview)
    setloading(false)
  }

  useEffect(()=>{
    loading && getProfileData()
  },[])

  return (
    <div className="userprofile">
    {!loading?
       <>
       <br />
        {questionsForReview.length > 0 && 
          <QuestionsForReview
          questions={questionsForReview} 
          animesoptions={animesToReview}/>
        }
        
        <br/>
        
          <Contributions approved={approvedcontributions} pending={pendingcontributions}/>
       </>  
       
       :
       <strong>loading</strong>
    }

 
    </div>
  )
}
