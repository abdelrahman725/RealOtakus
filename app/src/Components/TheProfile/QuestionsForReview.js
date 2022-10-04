import EachQuestion from "./EachQuestion"
import Select from 'react-select'
import { useState, useEffect } from "react"

const QuestionsForReview = ({questions, animes_for_review}) => {
  
  const [filtered_anime,setfiltered_anime]= useState()
  const [reviewstates,setreviewstates]= useState({})
  const [animes_options,setanimes_options]= useState([])

  const handlefilter=(e)=> {e ? setfiltered_anime(e.value) : setfiltered_anime()}

  useEffect(()=>{

    animes_for_review.map((anime) =>  
      setanimes_options(
        prev =>[...prev, { value:anime.anime_name, label:anime.anime_name }]
      )
    )
  },[])
  

  return (
    <div className="questionscontainer">
      <h2>questions for review</h2><br />
      
      <Select
        className="select_animes"
        placeholder="filter questions"
        isClearable={true} 
        options={animes_options}
        onChange={handlefilter} 
      />
        <br />  <br />

      {questions.map((q,index)=>(        
        !filtered_anime? 
          <EachQuestion 
            setreviewstate={setreviewstates}
            reviewstate={reviewstates[q.id]?reviewstates[q.id]:"reviewstate"} 
            anime={q.anime.anime_name}
            question={q}
            key={index}
          />
        :
          filtered_anime===q.anime.anime_name&&
          <EachQuestion 
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