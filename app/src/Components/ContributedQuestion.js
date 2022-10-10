const ContributedQuestion = ({contribution}) => {
  
  return (
    <div  className ={`eachquestion ${
      contribution.approved===true? "approvestate" : 
      contribution.approved===false? "declinestate" :
       "pendingstate"}`
      }>
      <p>
        <span> <strong> {contribution.question.anime.anime_name} </strong> </span>
        <br/>
         {contribution.question.question}
         {contribution.approved===false && contribution.reviewer_feedback}
      </p>
    </div>
  )
}

export default ContributedQuestion