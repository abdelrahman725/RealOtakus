import Quiz from "./Quiz"
import Result from "./Result"
import {useState,useContext} from "react"
import { GamdeModeContext} from "../App"
const Game = ({questions}) => {

  const [gameresults,setgameresults] = useState() 
  const [score,setscore] = useState()
 const {setUserData} = useContext(GamdeModeContext)
  const setresults = (results,score)=>
  {
    setgameresults(results)
    setscore(score)
    setUserData(prev => ({...prev, points :prev.points +score }))
  } 
    

  return (
    <>
    {gameresults ? 
    <Result results={gameresults} score={score} /> :
    <Quiz questions={questions} setgameresults= {setresults}/>
     }
    </>
  )
}

export default Game