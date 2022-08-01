import Game from "./Game"
import Select from 'react-select'
import { GamdeModeContext ,ServerContext} from "../App"

import {useState,useContext,useEffect} from 'react'

const QuizAnimes = () => {

  const {server} = useContext(ServerContext)
  const {setGameMode,GameMode,NUMBER_OF_QUIZ_QUESTIONS} = useContext(GamdeModeContext)

  const  animegameurl = `${server}/home/getgame`
  const  animesurl = `${server}/home/quizanimes`

  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [gamestarted,setgamestarted] = useState(false)


// get game animes 
  const GetAnimes = async()=>
  {
    console.log("requesting animes again !!!!")
    const res = await fetch(animesurl)
    const data  = await res.json()

    const games_dict = data.games
    const anime_array = []
    
    data.animes.map((anime) => 
    games_dict[anime.id] ?
    ShowAnime(games_dict[anime.id],anime.quiz_questions_count)&&anime_array.push({value:anime.id,label:anime.anime_name}):
    anime_array.push({value:anime.id,label:anime.anime_name}))
    
   setanimesoptions(anime_array)
  }

// get selected anime questions
  const GetGame = async(selectedanime)=>
  {
    const res = await fetch(`${animegameurl}/${selectedanime}`)
    const anime_questions  = await res.json()
  
    setgamequestions(anime_questions)
    setselected_anime()
    setgamestarted(true)
    setGameMode(true)    
  }

// compare the passed anime_approved_questions with the number of games that the user had for that anime
  const ShowAnime = (NumberOfGames,anime_questions)=>
  {
    // to delete later
    return true
    if ( anime_questions  >= (NumberOfGames * NUMBER_OF_QUIZ_QUESTIONS) + NUMBER_OF_QUIZ_QUESTIONS ){
      return true
    }
    return false
  }
    
  const handlesanimeselecttion=(e)=> {setselected_anime(e.value)}

  useEffect(()=>{
  GetAnimes()
  },[])

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