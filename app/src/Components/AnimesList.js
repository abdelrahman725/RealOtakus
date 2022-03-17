import Anime from "./Anime"
import Game from "./Game"
import {useState,useContext,useEffect} from 'react'
import { GamdeModeContext ,ServerContext} from "../App"


const Animes = () => {

  const {server} = useContext(ServerContext)
  const {GameMode} = useContext(GamdeModeContext)
  const {setGameMode} = useContext(GamdeModeContext)
  const  animegameurl = `${server}/home/getgame`
  const  animesurl = `${server}/home/animes`

  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setanime] = useState()

//animes that have questions only
  const GetAnimes = async()=>
  {
    const res = await fetch(animesurl)
    const animes = await res.json()
    setanimesoptions(animes)
  }


  const GetGame = async(selectedanime)=>
  {

    const res = await fetch(`${animegameurl}/${selectedanime}`)
    const anime_questions  = await res.json()

    if (anime_questions.length>=1)
    {
      setgamequestions(anime_questions)
      setGameMode(true)
    }
  
   
  }

  useEffect(()=>{
    !GameMode&& setanime() 
  },[GameMode])


  useEffect(()=>{
    GetAnimes()
  },[])


return (
  <>
    {GameMode ? <Game questions={gamequestions}/>
    :  
     <div>
      {animesoptions&&animesoptions.map((anime,index)=>(
        <Anime key={index} eachanime={anime} 
        onchoose={(a)=>setanime(a)} 
        selected={selected_anime}/>
        ))} <br />

      <button onClick={()=>selected_anime&&GetGame(selected_anime)}>start game</button>
     </div>
    }

  </>
 )}

export default Animes