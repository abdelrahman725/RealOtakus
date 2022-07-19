import Game from "./Game"
import {useState,useContext,useEffect} from 'react'
import Select from 'react-select'
import { GamdeModeContext ,ServerContext} from "../App"

const Animes = () => {

  const {server} = useContext(ServerContext)
  const {setGameMode,GameMode,NUMBER_OF_QUIZ_QUESTIONS} = useContext(GamdeModeContext)


  const  animegameurl = `${server}/home/getgame`
  const  animesurl = `${server}/home/quizanimes`

  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [startquiz,setquizstart] = useState()

  
// function to compare the passed anime_approved_questions with the number of games 
//that the user had for that anime

  const ShowAnime = (NumberOfGames,anime_questions)=>{
      if ( anime_questions  >= (NumberOfGames * NUMBER_OF_QUIZ_QUESTIONS) + NUMBER_OF_QUIZ_QUESTIONS ){
        return true
      }
      return false
  }

// get animes with approved questions
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


  const GetGame = async(selectedanime)=>
  {

    const res = await fetch(`${animegameurl}/${selectedanime}`)
    const anime_questions  = await res.json()

    if (anime_questions.length>=1)
    {
      setgamequestions(anime_questions)
      setGameMode(true)
      setquizstart(true)
    }
    setselected_anime()
  }
  

  const handleselect=(e)=> {setselected_anime(e.value)}

  useEffect(()=>{
    !startquiz&& GetAnimes()
  },[startquiz])



return (
  <>
    {startquiz?<Game questions={gamequestions}  setquizstart={setquizstart}/>
    
    :
    <div className="animeslist">
      <h2>which anime you want to take quiz in ?</h2>
      <br />
      
       <Select options={animesoptions} className="select_animes"  placeholder="select anime" 
        onChange={handleselect}  />
          <br /> <br />
          
          <h3>what about other animes ?</h3>
    
          <button className="startgame" onClick={()=>selected_anime&&GetGame(selected_anime)}>start the game !</button>

     </div>
     }


  </>
 )}

export default Animes