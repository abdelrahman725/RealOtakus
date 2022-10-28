import Question from "./Question"
import Result from "./Result"
import { GlobalStates } from "../../App"
import { useContext, useState, useEffect } from "react"
import async_http_request from "./AsyncRequest"

const Game = ({questions,setgamestarted}) => {

  const {N_Game_Questions,setGameMode,set_user_data,GameMode} = useContext(GlobalStates)
  const [useranswers,setuseranswers] = useState({})
  const [index,setindex] = useState(0)
  const [quizresults,setquizresults] = useState({}) 
  const [gamescore,setgamescore] = useState()
       
  const SubmitGame = async()=>{

    const game_results   = await async_http_request({
      path:"submitgame",
      method : "POST",
      data :  {"answers" : useranswers}
    })
    
    const answers = {}    

    game_results.right_answers.map((question)=>(
      answers[question.id] = question.right_answer
    ))
    
    localStorage.setItem("playing","0")
    setquizresults(answers)
    setgamescore(game_results.score)
    set_user_data(prev => ({...prev, points : prev.points + game_results.score }))    
    setGameMode(false)
  }
  
  const onAnswer = (id,each_new_answer)=> {
    const new_answers = useranswers
    new_answers[id] = each_new_answer
    setuseranswers(new_answers)
  }

  const nextquestion =()=> index < N_Game_Questions-1 && setindex(index+1)  

  useEffect(() =>{
    
    if (GameMode){

      document.onvisibilitychange =()=>{
        //localStorage.setItem("view",document.visibilityState)
        if (document.visibilityState === "hidden"){
          setgamestarted(false)
          setGameMode(false)
        }

        console.log(document.visibilityState)
      }

      localStorage.setItem("playing","1")

      window.onunload = ()=>{
        localStorage.setItem("playing","0")
      }
      
      window.onbeforeunload = ()=>{
        return true
      }
    }

    else{
      document.onvisibilitychange = null
    }

    return () => {
      localStorage.setItem("playing","0")
      window.onbeforeunload = null
      window.onunload= null
    }
      
  }, [GameMode])

  return(
    <div className="game_container">
      {GameMode ?

        <div className="game">
          <Question
          question={questions[index]}
          Q_no={index}
          onselect={onAnswer}
          questions_length={N_Game_Questions}
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
      :
        <Result
        results={quizresults}
        useranswers={useranswers}
        score={gamescore}
        questions={questions}/> 
      }
    </div>
  )
}

export default Game