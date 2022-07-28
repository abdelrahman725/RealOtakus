
const ApprovedQuestions = ({questions}) => {

    return (
      <div>
        <h2>approved  Contributions</h2><br />
        <div className="questionscontainer">
        { 
  
        questions.length>0?
        questions.map((q,index)=>(
          <div  className="eachquestion approvestate" key={index}>
             <p>
                <span><strong>{q.anime.anime_name}</strong></span><br />
                 {q.question}
              </p>
                
          </div>
        ))
        :
        
        "no approved contributions "
      }
      </div>
        <br />
        </div>
    )
  }
  
  export default ApprovedQuestions