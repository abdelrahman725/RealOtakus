import Anime from "./Anime"
import Game from "./Game"
import {useState,useContext,useEffect} from 'react'
import Select from 'react-select'
import { GamdeModeContext ,ServerContext} from "../App"


const Animes = () => {

  const {server} = useContext(ServerContext)
  const {setGameMode,GameMode} = useContext(GamdeModeContext)
  const  animegameurl = `${server}/home/getgame`
  const  animesurl = `${server}/home/animes`

  const [animesoptions,setanimesoptions] = useState()
  const [gamequestions,setgamequestions] = useState()
  const [selected_anime,setselected_anime] = useState()
  const [startquiz,setquizstart] = useState()


//animes that have questions only
  const GetAnimes = async()=>
  {
    const res = await fetch(animesurl)
    const animes = await res.json()

    const anime_array = []
    animes.map((anime) => 
    anime_array.push({value:anime.id,label:anime.anime_name})
    )

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
    !GameMode&& GetAnimes()
  },[GameMode])



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