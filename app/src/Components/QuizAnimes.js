import Game from "./Game"
import async_http_request from "./AsyncRequest"
import Select from 'react-select'

import { GamdeModeContext } from "../App"
import {useState,useContext,useEffect} from 'react'

const QuizAnimes = () => {

  const {setGameMode,GameMode,NUMBER_OF_QUIZ_QUESTIONS} = useContext(GamdeModeContext)

  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [gamestarted,setgamestarted] = useState(false)


// get game animes 
  const GetAnimes = async()=>
  {
    const game_animes = await async_http_request({path:"quizanimes"})

    const animes_array = []

    game_animes.animes.map((anime) => 
      animes_array.push({value:anime.id,label:anime.anime_name})
    )
    
   setanimesoptions(animes_array)
  }

// get selected anime questions
  const GetGame = async(selectedanime)=>
  {
    const anime_questions  = await async_http_request({path:`getgame/${selectedanime}`})
    
    console.log(anime_questions)
  
    setgamequestions(anime_questions)
    setselected_anime()
    setgamestarted(true)
    setGameMode(true)    
  }

  const handlesanimeselecttion=(e)=> {setselected_anime(e.value)}
  
  useEffect(()=>{
    GetAnimes()
  },[])


// compare the passed anime_approved_questions with the number of games that the user had for that anime
  const ShowAnime = (NumberOfGames,anime_questions)=>
  {
 
    if ( anime_questions  >= (NumberOfGames * NUMBER_OF_QUIZ_QUESTIONS) + NUMBER_OF_QUIZ_QUESTIONS ){
      return true
    }
    return false
  }  


return (
  <>
   { gamestarted ? 
    <Game questions={gamequestions} setgamestarted={setgamestarted}/>
    :
    <div className="animeslist">
       <h2>which anime you want to take quiz in ?</h2><br />
      
       <Select 
        className="select_animes"
        placeholder="select anime"
        options={animesoptions}
        onChange={handlesanimeselecttion}  />
        <br /> <br />
      
        <button className="startgame"
        onClick={()=> selected_anime && GetGame (selected_anime)}>
         Start Game 
        </button>
    </div>
    }
  </>
 )}

export default QuizAnimes