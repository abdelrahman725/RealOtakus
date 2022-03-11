import Anime from "./Anime"
import Game from "./Game"
import {useState,useContext,useEffect} from 'react'
import { GamdeModeContext ,ServerContext} from "../App"


const Animes = ({allanimes }) => {

  const {server} = useContext(ServerContext)
  const {GameMode} = useContext(GamdeModeContext)
  const {setGameMode} = useContext(GamdeModeContext)
  
  const  animegameurl = `${server}/home/getgame`
  
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setanime] = useState()


  const GetGame = async(selectedanime)=>
  {

    const res = await fetch(`${animegameurl}/${selectedanime}`)
    const anime_questions  = await res.json()
    setgamequestions(anime_questions)
    setGameMode(true)
    
  }

  useEffect(()=>{
    !GameMode&& setanime() 
  },[GameMode])



return (
  <>
    {GameMode ? <Game questions={gamequestions}/>
    :  
     <div>
      {allanimes.map((anime,index)=>(
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