import Game from "./Game"
import async_http_request from "./AsyncRequest"
import Select from 'react-select'

import { GlobalStates } from "../App"
import {useState,useContext,useEffect,useRef} from 'react'

const QuizAnimes = () => {

  const {N_Game_Questions,setGameMode,set_info_message} = useContext(GlobalStates)
  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [gamestarted,setgamestarted] = useState(false)

  const anime_select = useRef(null)

// get game animes 
  const GetAnimes = async()=>{
    
    setanimesoptions()
    
    const quiz_animes_result = await async_http_request({path:"gameanimes"})
    
    if (quiz_animes_result===null){
      set_info_message("network error")
      return
    }

    const animes_array = []

    quiz_animes_result.animes.map((anime) => 
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
  const GetGame = async()=>{

    const game  = await async_http_request({path:`getgame/${ selected_anime.value }`})
    
    if (game.info !== "ok"){
      console.log(game.info)
      return
    }
    
    setgamequestions(game.game_questions)
    setselected_anime()
    setgamestarted(true)
    setGameMode(true)    
  }

  const on_anime_select=(selected)=> {
    setselected_anime(selected)
    anime_select.current.blur()
  }
  
  useEffect(()=>{  
    GetAnimes()
  },[])

  const hide_anime = (n_interactions,anime_active_questions)=>
  { 
    if ( (anime_active_questions - n_interactions) >= N_Game_Questions ){
      return false
    }
    return true
  }  

 return (
  <>
   { gamestarted ? 

   <Game
      questions={gamequestions}
      setgamestarted={setgamestarted}
      fetch_quiz_animes = {GetAnimes}
    />
    :
    <div className="centered_div animeslist">
      
       <Select 
        className="select_animes"
        placeholder="select anime"
        value={selected_anime}
        isClearable= {true}
        options={animesoptions}
        isLoading={animesoptions?false:true}
        onChange={on_anime_select}
        isOptionDisabled={(option) => hide_anime(option.user_interactions, option.anime_questions)}
        ref={anime_select}
        />
        <br /> <br />
      
        <button className="startgame"
        onClick={()=> selected_anime ? GetGame () : anime_select.current.focus() }>
         Start Game 
        </button>
    </div>
    }
  </>
 )}

export default QuizAnimes
