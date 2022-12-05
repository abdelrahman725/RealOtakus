import ReviewQuestion from "./Components/ReviewQuestion"
import async_http_request from "./Components/AsyncRequest"
import Select from 'react-select'
import { useState, useEffect,useRef,useContext } from "react"
import { GlobalStates } from "../App"
import {useLocation} from 'react-router-dom';

const QuestionsForReview = () => {

  const {set_info_message,SelectStyles} = useContext(GlobalStates)
  const [questions,setquestions]= useState()
  const [reviewstates,setreviewstates]= useState({})
  const [animes_options,setanimes_options]= useState([])
  const anime_select = useRef(null)
  const location = useLocation()
  const [selected_anime,setselected_anime]= useState()

  const handle_questions_filter=(selected)=> {
    setselected_anime(selected)
    anime_select.current.blur()
  }
  

  useEffect(()=>{      
    let cancled = false
    setselected_anime(location.state) 

    async function fetch_questions(){
      const questions_result  = await async_http_request({ path:"get_review_contribution" })
      if (questions_result===null){
        set_info_message("network error")
        return
      }

      //console.log(questions_result.questions)

      if (cancled ===false){
        const animes_set = new Set()

        questions_result.questions.map((question) => animes_set.add(question.anime.anime_name))

        animes_set.forEach(anime => {
          setanimes_options(
            prev =>[...prev, { value:anime, label:anime }]
          )
        })

        setquestions(questions_result.questions)   
      } 
    }
    
    fetch_questions()
    
    return ()=>{
      setanimes_options([])
      cancled = true
    }

  },[])
  

  return (
    <div className="review_page">
      <h2 className="title">
        <span>{questions && questions.length}</span> contributions need review
      </h2>
      <br />
 
      <Select
      value={selected_anime}
      styles={SelectStyles}
      className="select_animes"
      placeholder="filter questions"
      isClearable={true} 
      isLoading={!questions}
      options={animes_options}
      onChange={handle_questions_filter} 
      ref={anime_select}
      />
    
        <br />  <br />

      {questions&&questions.map((q,index)=>(        
        !selected_anime? 
          <ReviewQuestion 
            setreviewstate={setreviewstates}
            reviewstate={reviewstates[q.id]?reviewstates[q.id]:"pendingstate"} 
            anime={q.anime.anime_name}
            question={q}
            key={index}
          />
        :
          selected_anime.value===q.anime.anime_name&&
          <ReviewQuestion 
            setreviewstate={setreviewstates}
            reviewstate={reviewstates[q.id]?reviewstates[q.id]:"pendingstate"} 
            anime={q.anime.anime_name}
            question={q} 
            key={index}
          />      
          
     ))}
    </div>
  )
}

export default QuestionsForReview