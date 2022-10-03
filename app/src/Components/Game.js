import Question from "./Question"
import Result from "./Result"
//import Loading from "./Loading"

import { GamdeModeContext } from "../App"
import { useContext, useState, useEffect } from "react"
import async_http_request from "./AsyncRequest"

const Game = ({fetch_quiz_animes, questions,setgamestarted}) => {

  const {setGameMode,setUserData,GameMode} = useContext(GamdeModeContext)
  const [useranswers,setuseranswers] = useState({})
  const [index,setindex] = useState(0)
  const questions_length = questions.length
  
  const [quizresults,setquizresults] = useState({}) 
  const [gamescore,setgamescore] = useState()
  
  
  useEffect(()=>{
  if (GameMode)
  {
    window.addEventListener('beforeunload', alertUserbeforeleaving)
    return () => {
      window.removeEventListener('beforeunload', alertUserbeforeleaving)
    }
  } 
},[GameMode])

  const alertUserbeforeleaving = e => {
    e.preventDefault()
    e.returnValue = ''
  }
      

  const nextquestion = ()=>  index < questions_length-1 && setindex(index+1)  

  const onAnswer = (id,each_new_answer)=>
  {
    const new_answers = useranswers
    new_answers[id] = each_new_answer
    setuseranswers(new_answers)
  }

  const SubmitGame = async()=>
  {
   
    const game_results   = await async_http_request({
      path:"submitgame",
      method : "POST",
      data :  {"answers" : useranswers}
    })
    
    const answers = {}    

    game_results.right_answers.map((question)=>(
      answers[question.id] = question.right_answer
    ))
    
    setquizresults(answers)
    setgamescore(game_results.score)
    setUserData(prev => ({...prev, points : prev.points + game_results.score }))    
    setGameMode(false)
  }

  return (
    <>
    {GameMode ?
    <div className="Quiz">   
        <Question
        question={questions[index]}
        Q_no={index}
        onselect={onAnswer}
        questions_length={questions_length}
        nextquestion={nextquestion}/>
        
        <br /> 
        
        <div className="buttoncontainer">
            <button onClick={()=>{
              setgamestarted(false)
              setGameMode(false)
              fetch_quiz_animes()
              }}>
              exit
            </button>
            
            {index===questions_length-1&& 
            <button onClick={SubmitGame}>
              submit
            </button>}
            
            <button
            onClick={nextquestion}
            className={index===questions_length-1?"faded":""}
            hidden={index===questions_length-1}>
              next
            </button>            
        </div>
    </div> 
    :
    <Result
    results={quizresults}
    useranswers={useranswers}
    score={gamescore}
    questions={questions}/> 
  }
  </>
  )
}

export default Game