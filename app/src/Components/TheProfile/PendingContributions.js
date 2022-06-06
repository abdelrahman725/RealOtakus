
const PendingQuestions = ({questions}) => {

  return (
    <div>
      <h2>Pending Contributions</h2><br />
      <div className="pendingquestionscontainer">
      {

      questions.length>0?
      questions.map((q,index)=>(
        <div  className="eachquestion pendingstate" key={index}>
           <p>
              <span><strong>{q.anime.anime_name}</strong></span><br />
               {q.question}
            </p>
              
        </div>
      ))
      :
      
      "you don't have any  pending contributions "
    }
    </div>
      <br />
      </div>
  )
}

export default PendingQuestions