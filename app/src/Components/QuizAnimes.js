import Game from "./Game"
import async_http_request from "./AsyncRequest"
import Select from 'react-select'

import { GamdeModeContext } from "../App"
import {useState,useContext,useEffect,useRef} from 'react'

const QuizAnimes = () => {

  const {setGameMode} = useContext(GamdeModeContext)
  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [gamestarted,setgamestarted] = useState(false)

  const anime_select = useRef(null)

// get game animes 
  const GetAnimes = async()=>
  {
    setanimesoptions()

    const animes_data = await async_http_request({path:"gameanimes"})
    console.log(animes_data.animes)
    const animes_array = []

    animes_data.animes.map((anime) => 
      animes_array.push({
        value:anime.id,
        label:anime.anime_name,
        user_interactions:anime.n_user_interactions,
        anime_questions:anime.n_active_questions
      })
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

  const handlesanimeselecttion=(e)=> { e ? setselected_anime(e.value) :setselected_anime()}
  
  useEffect(()=>{
    GetAnimes()
  },[])

  const hide_anime = (n_interactions,anime_active_questions)=>
  { 
    if ( (anime_active_questions - n_interactions) >= 5 ){
      return false
    }
    return true
  }  


return (
  <>
   { gamestarted ? 
    <Game questions={gamequestions} setgamestarted={setgamestarted} fetch_quiz_animes = {GetAnimes}/>
    :
    <div className="animeslist">
       <h2>which anime you want to take quiz in ?</h2><br />
      
       <Select 
        className="select_animes"
        placeholder="select anime"  
        isClearable= {true}
        options={animesoptions}
        isLoading={animesoptions?false:true}
        onChange={handlesanimeselecttion}
        isOptionDisabled={(option) => hide_anime(option.user_interactions, option.anime_questions)}
        ref={anime_select}
        />
        <br /> <br />
      
        <button className="startgame"
        onClick={()=> selected_anime ? GetGame (selected_anime) : anime_select.current.focus() }>
         Start Game 
        </button>
    </div>
    }
  </>
 )}

export default QuizAnimes
