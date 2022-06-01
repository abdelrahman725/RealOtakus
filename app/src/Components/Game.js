import Quiz from "./Quiz"
import Result from "./Result"
import Loading from "./Loading"

import {useState,useContext} from "react"
import { GamdeModeContext} from "../App"

const Game = ({questions,setquizstart}) => {

  const {setGameMode,GameMode} = useContext(GamdeModeContext)

  const [quizresults,setquizresults] = useState({}) 
  const [score,setscore] = useState()
  const {setUserData} = useContext(GamdeModeContext)
  const [useranswers,setuseranswers] = useState()
  const [resultview,setresultview] = useState(false)
  
  const makeresults = (results,score,level,answers)=>
  {
    setquizresults(results)
    setscore(score)
    setUserData(prev => ({...prev, points :prev.points + score }))
    setuseranswers(answers)

    setresultview(true)
    
    console.log("results loaded successfully !")
  }
    

  return (
    <>
    {!resultview && !GameMode &&<Loading/>}
    
    {resultview&& <Result setquizstart={setquizstart} results={quizresults} score={score}  questions={questions}
    useranswers={useranswers}/> }


    {GameMode&&<Quiz questions={questions} setgameresults= {makeresults}  setquizstart={setquizstart} />}
    
    </>
  )
}

export default Game