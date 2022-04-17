import { ServerContext } from "../App"
import { useContext, useState, useEffect } from "react"
const Profile = () => {

  const {server} = useContext(ServerContext)
  const profileurl  = `${server}/home/profile`

  const[mydata,setmydata]= useState()
  const[pendingcontributions,setpendingcontributions]= useState()
  const[reviews,setreviews]= useState()

  const[loading,setloading]= useState(true)

  const LoadData =async()=>
  {
    const res = await fetch(profileurl)
    const data  = await res.json()
      setmydata(data.data)
      setpendingcontributions(data.pendingcontributions)
      setreviews(data.pending_reviews)
      setloading(false)
      console.log(data)

  }


  useEffect(()=>{
    LoadData()
  },[])

  return (
    <> 
    {!loading?
    <strong>data has been loaded successfully</strong>:
    <strong>still loading</strong>
    }
    </>
  )
}

export default Profile

