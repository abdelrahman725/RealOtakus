import ReviewQuestion from "./ReviewQuestion"
import async_http_request from "./AsyncRequest"
import Select from 'react-select'
import { useState, useEffect,useRef,useContext } from "react"
import { GlobalStates } from "../App"

const QuestionsForReview = () => {

  const {set_info_message} = useContext(GlobalStates)
  const [questions,setquestions]= useState()
  const [selected_anime,setselected_anime]= useState()
  const [reviewstates,setreviewstates]= useState({})
  const [animes_options,setanimes_options]= useState([])
  const [loading,setloading] = useState(true)
  const anime_select = useRef(null)

  const handle_questions_filter=(selected)=> {
    setselected_anime(selected)
    anime_select.current.blur()
  }
  

  useEffect(()=>{
    let cancled = false

    async function fetch_questions(){

      const questions_result  = await async_http_request({ path:"review" })
      if (questions_result===null){
        set_info_message("network error")
        return
      }
      
      if (cancled ===false){
        const animes_set = new Set()

        questions_result.questions.map((question) => animes_set.add(question.anime.anime_name))

        animes_set.forEach(anime => {
          setanimes_options(
            prev =>[...prev, { value:anime, label:anime }]
          )
        })

        setquestions(questions_result.questions)  
        setloading(false)
      
      } 
    }
    
    fetch_questions()
    
    return ()=>{
      setanimes_options([])
      cancled = true
    }

  },[])
  

  return (
    <div className="centered_div questionscontainer">
      
      <h2>contributed questions that need review</h2>
      <br />
 
      <Select
        className="select_animes"
        placeholder="filter questions"
        isClearable={true} 
        isLoading={animes_options.length <= 0}
        options={animes_options}
        onChange={handle_questions_filter} 
        ref={anime_select}
        />
    
        <br />  <br />

      {questions&&questions.map((q,index)=>(        
        !selected_anime? 
          <ReviewQuestion 
            setreviewstate={setreviewstates}
            reviewstate={reviewstates[q.id]?reviewstates[q.id]:"reviewstate"} 
            anime={q.anime.anime_name}
            question={q}
            key={index}
          />
        :
          selected_anime.value===q.anime.anime_name&&
          <ReviewQuestion 
            setreviewstate={setreviewstates}
            reviewstate={reviewstates[q.id]?reviewstates[q.id]:"reviewstate"} 
            anime={q.anime.anime_name}
            question={q} 
            key={index}
          />      
          
     ))}
    </div>
  )
}

export default QuestionsForReview