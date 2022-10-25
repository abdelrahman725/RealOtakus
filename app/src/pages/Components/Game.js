import Question from "./Question"
import Result from "./Result"
import { GlobalStates } from "../../App"
import { useContext, useState, useEffect } from "react"
import async_http_request from "./AsyncRequest"

const Game = ({questions}) => {

  const {N_Game_Questions,setGameMode,set_user_data,GameMode} = useContext(GlobalStates)
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
    set_user_data(prev => ({...prev, points : prev.points + game_results.score }))    
    setGameMode(false)
  }

  return (
    <div className="game_container">
      {GameMode ?
      <div className="game">   
          <Question
          question={questions[index]}
          Q_no={index}
          onselect={onAnswer}
          questions_length={questions_length}
          nextquestion={nextquestion}/>
          
          <br /> 
          
          <div className="game_buttons">
              {index===questions_length-1 ? 
              <button onClick={SubmitGame} className="submit_btn"> submit </button>
              : 
              <button onClick={nextquestion} style={{backgroundColor: "#365FAA"}}> next </button>            
              }
          </div>
      </div> 
      :
      <Result
      n_quiz_questions={N_Game_Questions}
      results={quizresults}
      useranswers={useranswers}
      score={gamescore}
      questions={questions}/> 
      }
  </div>
  )
}

export default Game