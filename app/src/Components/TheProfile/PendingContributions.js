
const PendingQuestions = ({questions}) => {

  return (
    <div>
      <h2>your Pending Contributions</h2><br />
      <div className="pendingquestionscontainer">
      {

      questions.length>0?
      questions.map((q,index)=>(
        <div  className="eachquestion" key={index}>

           <p>
              <span><strong>{q.anime.anime_name}</strong></span>
               {q.question}
            </p>
              
        </div>
      ))
      :
      
      "you don't have any  questions contributed yet"
    }
    </div>
      <br />
      </div>
  )
}

export default PendingQuestions