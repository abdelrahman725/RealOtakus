import Question from "./Question"
import { GamdeModeContext } from "../App"
import { useContext } from "react"

const Game = ({questions}) => {
  const gamemode= useContext(GamdeModeContext)
  
  return (
    <>
     {questions.map((q,index)=>(
     <Question key={index} each_question={q}/>
    ))}

    </>
  )
}

export default Game