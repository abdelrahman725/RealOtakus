import Anime from "./Anime"
import {useState} from 'react'

const Animes = ({allanimes,startest}) => {

  const [selected_anime,setanime] = useState()


  return (
    <>
    {allanimes.map((anime,index)=>(
     <Anime key={index} eachanime={anime} 
     onchoose={(a)=>setanime(a)} 
     selected={selected_anime}/>
    ))}
      <br />

     <button onClick={()=>selected_anime&&startest(selected_anime)}>
       start game
      </button>
 
    </>
  )
}

export default Animes