import Question from "./Question"
import { GlobalStates } from "../../App"
import { useContext, useState, useEffect } from "react"
import async_http_request from "./AsyncRequest"

const Game = ({
  questions,
  useranswers,
  setuseranswers,
  setquizresults,
  setgame_score
}) => {

  const { N_Game_Questions, setgame_started, set_user_data } = useContext(GlobalStates)
  const [index,setindex] = useState(0)
  const [timeout,settimout] = useState(false)
       
  const SubmitGame = async()=>{

    window.scrollTo({ top: 0, behavior: 'smooth' })
    setgame_started(false)

    const game_results = await async_http_request({
      path   : "submitgame",
      method : "POST",
      data   : {"answers" : useranswers}
    })
    
    const answers = {}   
    let score = 0
    
    game_results.right_answers.map((question)=>((
      answers[question.id] = question.right_answer,
      question.right_answer === useranswers[question.id]  && ( score+=1 )
      
    )))

    //set_user_data(prev => ({...prev, points : prev.points + score }))   
    setgame_score(score)
    setquizresults(answers)
  }
  
  const onAnswer = (id, each_new_answer)=> {
    const new_answers = useranswers
    new_answers[id] = each_new_answer
    setuseranswers(new_answers)
  }

  const nextquestion =()=> index < N_Game_Questions-1 && setindex(index+1)  

  useEffect(() =>{
    
    window.onbeforeunload = ()=>{
      return true
    }
    
    document.onvisibilitychange =()=>{
      if (document.visibilityState === "hidden"){
        console.log("leaving quiz")
        setgame_started()
      }
      console.log(document.visibilityState)
    }
        
    return () => {
      document.onvisibilitychange = null
      window.onbeforeunload = null
    }
      
  }, [])

  return(
    <div className="game_container">
      <br/>
      
      <Question
      question={questions[index]}
      question_index={index}
      onselect={onAnswer}
      questions_length={N_Game_Questions}
      timeout={timeout}
      settimout={settimout}
      nextquestion={nextquestion}/>
    
      <br />  
      <div className="game_buttons">
        
        {index===N_Game_Questions-1 ?
          <button onClick={SubmitGame} className="submit_btn"> Submit </button>
        : 
          <button onClick={nextquestion} style={{backgroundColor: "#365FAA"}}> next </button>            
        }
      </div>
    </div>
  )
}

export default Game