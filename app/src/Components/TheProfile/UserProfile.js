import PendingQuestions from './PendingContributions'
import QuestionsForReview from './QuestionsForReview'
import ApprovedQuestions from './ApprovedContributions'
import Animes from './Animes'

import { useContext, useState, useEffect } from "react"
import { ServerContext } from '../../App'

export const UserProfile = () => {
  
  const {server} = useContext(ServerContext)
  const profileurl  = `${server}/home/profile`

  const[mydata,setmydata]= useState()
  const[approved_contributions,setapproved_contributions]= useState([])

  const[pending_contributions,setpending_contributions]= useState([])
  const[questionsForReview,setquestionsForReview]= useState([])
  const[animes,setanimes]= useState([])
  const[animesToReview,setanimesToReview] = useState([])

  const[loading,setloading]= useState(true)

  const LoadData =async()=>
  {
    const res = await fetch(profileurl)
    const data  = await res.json()
      setmydata(data.data)
      
      const anime_options = [{value:1,label:"all animes"}]
      
      const anime_names = new Set()
      data.questionsForReview.map((question ) => 
      anime_names.add(question.anime.anime_name)
      )

      Array.from(anime_names).map((a) => 
      anime_options.push({value:a,label:a})
      )

      //console.log(data.UserContributions)

      data.UserContributions.map((q) =>
    
      q.approved===true ?
    
      setapproved_contributions(prev_approved => [...prev_approved,q]):  
      setpending_contributions(prev_pending => [...prev_pending,q])
      )

      setanimesToReview(anime_options)
      setanimes(data.animes_with_contributions)

      setquestionsForReview(data.questionsForReview)
      
      setloading(false)

  }

  useEffect(()=>{
    loading&&LoadData()
  },[])

  return (
    <div className="userprofile">
       {!loading?
       <>
       <br />
        {questionsForReview.length >0&& <QuestionsForReview questions={questionsForReview} 
        animesoptions={animesToReview}/>}
        <br />

        <PendingQuestions questions={pending_contributions}/>
        <hr />
        <ApprovedQuestions questions={approved_contributions}/>

        {/* <Animes animes={animes} N_Contributions={mydata.contributions_count}/>  */}
       </>  
       
       :<strong>loading</strong>
    }

 
    </div>
  )
}
