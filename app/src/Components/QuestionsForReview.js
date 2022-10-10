import ReviewQuestion from "./ReviewQuestion"
import async_http_request from "./AsyncRequest"
import Select from 'react-select'
import { useState, useEffect } from "react"

const QuestionsForReview = () => {
  
  const [animes,setanimes] = useState([])
  const [questions,setquestions]= useState([])
  const [filtered_anime,setfiltered_anime]= useState()
  const [reviewstates,setreviewstates]= useState({})
  const [animes_options,setanimes_options]= useState([])

  const handlefilter=(e)=> {e ? setfiltered_anime(e.value) : setfiltered_anime()}
  
  const fetch_questions = async () =>{

    const res  = await async_http_request({ path:"review" })

    res.animes.map((anime) =>  
      setanimes_options(
        prev =>[...prev, { value:anime.anime_name, label:anime.anime_name }]
      )
    )

    setanimes(res.animes)
    setquestions(res.questions)  
  }
  
  useEffect(()=>{ fetch_questions() },[])
  

  return (
    <div className="questionscontainer">
      <h2>questions for review</h2><br />
      
      <Select
        className="select_animes"
        placeholder="filter questions"
        isClearable={true} 
        isLoading={animes_options ? false: true}
        options={animes_options}
        onChange={handlefilter} 
      />
        <br />  <br />

      {questions.map((q,index)=>(        
        !filtered_anime? 
          <ReviewQuestion 
            setreviewstate={setreviewstates}
            reviewstate={reviewstates[q.id]?reviewstates[q.id]:"reviewstate"} 
            anime={q.anime.anime_name}
            question={q}
            key={index}
          />
        :
          filtered_anime===q.anime.anime_name&&
          <ReviewQuestion 
            setreviewstate={setreviewstates}
            reviewstate={reviewstates[q.id]?reviewstates[q.id]:"reviewstate"} 
            anime={q.anime.anime_name}
            question={q} 
            key={index}
          />      
          
     ))}
      <hr />
    </div>
  )
}

export default QuestionsForReview