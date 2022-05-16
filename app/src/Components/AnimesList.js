import Anime from "./Anime"
import Quiz from "./Quiz"
import {useState,useContext,useEffect} from 'react'
import { GamdeModeContext ,ServerContext} from "../App"


const Animes = () => {

  const {server} = useContext(ServerContext)
  const {setGameMode,GameMode} = useContext(GamdeModeContext)
  const  animegameurl = `${server}/home/getgame`
  const  animesurl = `${server}/home/animes`

  const [animesoptions,setanimesoptions] = useState()
  const [restaniems,setresanimes] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [startquiz,setquizstart] = useState()


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
      setquizstart(true)
      setGameMode(true)
    }
  }
  const [len,setlen] = useState(3)
  

  useEffect(()=>{
    GetAnimes()
  },[])


  useEffect(()=>{
    !startquiz && setselected_anime()
  },[startquiz])



return (
  <>
    {startquiz?<Quiz questions={gamequestions} setquizstart={setquizstart}/>
    :
    <div className="animeslist">
       <div className="animes_choices">
            {animesoptions&&animesoptions.map((anime,index)=>(
              index <len&&
              <Anime key={index} eachanime={anime}           
              onchoose={(a)=>setselected_anime(a)} 
              selected={selected_anime}/>
              ))} 
        </div>

          <button className="show"
          onClick={()=>setlen(len===3?animesoptions.length:3)}>show {len===3?"more...":"less"}</button><br />
          <button className="startgame" onClick={()=>selected_anime&&GetGame(selected_anime)}>start the game !</button>

     </div>}


  </>
 )}

export default Animes