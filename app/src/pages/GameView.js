import Game from "./Components/Game"
import Result from "./Components/Result"

import async_http_request from "./Components/AsyncRequest"
import Select from 'react-select'
import { GlobalStates } from "../App"
import {useState,useContext,useEffect,useRef} from 'react'

const GameView = () => {

  const {SelectStyles, N_Game_Questions, game_started, setgame_started, set_info_message} = useContext(GlobalStates)
  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [quizresults,setquizresults] = useState({}) 
  const [useranswers,setuseranswers] = useState({})
  const [gamescore,setgamescore] = useState()

  const anime_select = useRef(null)

  // get selected anime questions
  const GetGame = async()=>{
    
    setquizresults({})
    setuseranswers({})

    const game  = await async_http_request({path:`getgame/${ selected_anime.value }`})
    
    if (game.info !== "ok"){
      console.log(game.info)
      return
    }
    
    setselected_anime()
    setgamequestions(game.game_questions)
    setgame_started(true)
  }

  const on_anime_select=(selected)=> {
    setselected_anime(selected)
    anime_select.current.blur()
  }

  const hide_anime = (n_interactions,anime_active_questions)=>{ 
    if ( (anime_active_questions - n_interactions) >= N_Game_Questions ){
      return false
    }
    return true
  }  

  useEffect(()=>{

    async function GetAnimes(){
    
      setanimesoptions()
      
      const quiz_animes_result = await async_http_request({path:"getgameanimes"})
      
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

    GetAnimes()
    anime_select.current.focus()

    return()=>{
      setgame_started()
    }
    
  },[])

 return (
  <>
  { game_started===undefined &&
    <div className="centered_div animeslist"> 
      <Select 
      styles={SelectStyles}
      className="select_animes"
      placeholder="select anime"
      value={selected_anime}
      isClearable= {true}
      options={animesoptions}
      isLoading={animesoptions?false:true}
      onChange={on_anime_select}
      isOptionDisabled={(option) => hide_anime(option.user_interactions, option.anime_questions)}
      ref={anime_select}/>  
      <br />
      <button className="submit_btn" onClick={()=> selected_anime ? GetGame() : anime_select.current.focus()} >
        Start Game 
      </button>
    </div>
  }

   { game_started===true && 
    <Game questions={gamequestions} setgamescore={setgamescore} setquizresults={setquizresults} setuseranswers={setuseranswers} useranswers={useranswers} />
   }

   { game_started===false && 
    <Result results={quizresults} useranswers={useranswers} score={gamescore} questions={gamequestions}/> 
   }

  </>
 )}

export default GameView
