import Competitor from "./Competitor"
import { useEffect,useState,useContext } from "react"
import { ServerContext } from "../App"

const AnimesDashBoard = () => {
  const {server} = useContext(ServerContext)
  const url = `${server}/home/dashboard`


  const GetAnimesDashbBoard = async()=>
  {
    const res = await fetch(url)
    const dashboard= await res.json()
  }


  return (
    <div>AnimesDashBoard</div>
  )
}

export default AnimesDashBoard