const ContributedQuestion = ({contribution}) => {
  
  return (
    <div  className ={`contributed_question ${
      contribution.approved===true? "approvestate" : 
      contribution.approved===false? "declinestate" :
       "pendingstate"}`
      }>
      <p>
         <strong> {contribution.question.anime.anime_name} </strong> 
        <br/><br />
         {contribution.question.question}<br/>
         {contribution.approved===false && contribution.reviewer_feedback}
      </p>
    </div>
  )
}

export default ContributedQuestion