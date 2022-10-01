import Game from "./Game"
import async_http_request from "./AsyncRequest"
import Select from 'react-select'

import { GamdeModeContext } from "../App"
import {useState,useContext,useEffect} from 'react'

const QuizAnimes = () => {

  const {setGameMode, NUMBER_OF_QUIZ_QUESTIONS} = useContext(GamdeModeContext)

  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [gamestarted,setgamestarted] = useState(false)


// get game animes 
  const GetAnimes = async()=>
  {
    const animes_data = await async_http_request({path:"gameanimes"})
    
    console.log(animes_data.animes)

    const animes_array = []

    animes_data.animes.map((anime) => 
      animes_array.push({value:anime.id,label:anime.anime_name})
    )
    
   setanimesoptions(animes_array)
  }

// get selected anime questions
  const GetGame = async(selectedanime)=>
  {
    const anime_questions  = await async_http_request({path:`getgame/${selectedanime}`})
  
    setgamequestions(anime_questions)
    setselected_anime()
    setgamestarted(true)
    setGameMode(true)    
  }

  const handlesanimeselecttion=(e)=> {setselected_anime(e.value)}
  
  useEffect(()=>{
    GetAnimes()
  },[])


// difference between number of total available anime quizes and number of quizes that the user had for that anime
// and accordingly determine if there is an available quiz or not for each anime 
  const IsAnimeAvailable = (n_interactions,anime_questions)=>
  { 
    if ( Math.floor(anime_questions/NUMBER_OF_QUIZ_QUESTIONS) -  Math.ceil(n_interactions/NUMBER_OF_QUIZ_QUESTIONS) > 0 ){
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
        isLoading={animesoptions?false:true}
        isClearable= {true}
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
