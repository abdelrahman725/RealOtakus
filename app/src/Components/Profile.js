import { ServerContext } from "../App"
import { useContext, useState, useEffect } from "react"
const Profile = () => {

  const {server} = useContext(ServerContext)
  const profileurl  = `${server}/home/profile`

  const[mydata,setmydata]= useState()
  const[contributions,setcontributions]= useState()
  const[posts,setposts]= useState()
  const[loading,setloading]= useState(true)

  const LoadData =async()=>
  {
    const res = await fetch(profileurl)
    const data  = await res.json()
      setmydata(data.data)
      setcontributions(data.contributions)
      setposts(data.posts)
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