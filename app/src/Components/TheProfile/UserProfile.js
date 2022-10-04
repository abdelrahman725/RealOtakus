import Contributions from './Contributions'
import QuestionsForReview from './QuestionsForReview'

import { useState, useEffect } from "react"
import async_http_request from '../AsyncRequest'

export const UserProfile = () => {
  
  const[questionsForReview,setquestionsForReview]= useState([])
  const[animes_for_review,setanimes_for_review] = useState([])
  const[approved_contributions,set_approved_contributions]= useState([])
  const[pending_contributions,set_pending_contributions]= useState([])
  const[rejected_contributions,set_rejected_contributions]= useState([])

  const[loading,setloading]= useState(true)


  const getProfileData = async()=>{

    const data  = await async_http_request({path:"profile"})
        
    setanimes_for_review(data.animes_for_review)
    setquestionsForReview(data.questions_to_review)
    
    data.user_contributions.map((contribution) =>  {
      contribution.approved===null  && set_pending_contributions(pending => [...pending, contribution])
      contribution.approved===false && set_rejected_contributions(rejected => [...rejected, contribution])
      contribution.approved===true  && set_approved_contributions(approved => [...approved, contribution])  
    })

    setloading(false)
  }

  useEffect(()=>{
    getProfileData()
  },[])

  return (
    <div className="userprofile">
    {!loading?
       <>
       <br/>
        {questionsForReview.length > 0 && 
          <QuestionsForReview
          questions={questionsForReview} 
          animes_for_review={animes_for_review}/>
        }    
        <br/>
    
          <Contributions 
          pending={pending_contributions}
          approved={approved_contributions}
          rejected={rejected_contributions}
          />
       </>  

       :
       <strong>loading</strong>
    }


    </div>
  )
}
