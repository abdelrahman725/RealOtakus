import Quiz from "./Quiz"
import Result from "./Result"
import {useState} from "react"
const Game = ({questions}) => {

  const [gameresults,setgameresults] = useState() 
  const [score,setscore] = useState()

  const setresults = (results,score)=>
  {
    setgameresults(results)
    setscore(score)
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