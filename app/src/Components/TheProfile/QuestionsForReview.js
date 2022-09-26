import EachQuestion from "./EachQuestion"
import Select from 'react-select'
import { useState } from "react"

const QuestionsForReview = ({questions,animesoptions}) => {
  
  const [filteredanime,setfilteredanime]= useState(1)
  const [reviewstates,setreviewstates]= useState({})

  const handlefilter=(e)=> {setfilteredanime(e.value)}

  return (
    <div className="questionscontainer">
      <h2>questions for review</h2><br />
      <Select options={animesoptions} className="select_animes"  placeholder="filter questions" 
        onChange={handlefilter} />
        <br />
        <br />

      {questions.map((q,index)=>(        
        filteredanime===1? 
        <EachQuestion setreviewstate={setreviewstates}
        reviewstate={reviewstates[q.id]?reviewstates[q.id]:"reviewstate"} 
        anime={q.anime.anime_name} question={q} key={index}/>
        :
        filteredanime===q.anime.anime_name&&
        <EachQuestion setreviewstate={setreviewstates}
        reviewstate={reviewstates[q.id]?reviewstates[q.id]:"reviewstate"} 
        anime={q.anime.anime_name} question={q} key={index}/>      
          
     ))}
      <hr />
    </div>
  )
}

export default QuestionsForReview