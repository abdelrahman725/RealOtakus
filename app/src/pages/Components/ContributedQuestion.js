const ContributedQuestion = ({contribution}) => {
  
  return (
    <div  className ={`contributed_question ${
      contribution.approved===true? "approvestate" : 
      contribution.approved===false? "declinestate" :
       "pendingstate"}`
      }>
      <p>
         {contribution.question.question}<br/>
         {contribution.approved===false && contribution.reviewer_feedback}
      </p>
    </div>
  )
}

export default ContributedQuestion