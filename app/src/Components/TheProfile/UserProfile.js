import { ServerContext } from '../../App'
import PendingQuestions from './PendingQuestions'
import Reviews from "./Reviews"
import Animes from './Animes'
import { useContext, useState, useEffect } from "react"

export const UserProfile = () => {
  
  const {server} = useContext(ServerContext)
  const profileurl  = `${server}/home/profile`

  const[mydata,setmydata]= useState()
  const[pendingcontributions,setpendingcontributions]= useState()
  const[reviews,setreviews]= useState()
  const[animes,setanimes]= useState()

  const[loading,setloading]= useState(true)

  const LoadData =async()=>
  {
    const res = await fetch(profileurl)
    const data  = await res.json()
      setmydata(data.data)
      setpendingcontributions(data.PendingContributions)
      setreviews(data.ToReview)
      setanimes(data.animes)
      setloading(false)

     //console.log("user own data : ",data.data)
     console.log("animes that you contributed to  : ",data.animes_with_contributions)
     //console.log("questions that you  have created but are not approved yet : ",data.PendingContributions)
  }


  useEffect(()=>{
    LoadData()
  },[])

  return (
    <div>
       {!loading?
    <strong>data has been loaded successfully</strong> :
    <strong>still loading</strong>
    }

 
    </div>
  )
}
