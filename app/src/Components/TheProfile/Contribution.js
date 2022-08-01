const Contribution = ({is_approved,question}) => {
  return (
    <div  className ={`eachquestion ${is_approved?"approvestate":"pendingstate"}`} >
      <p>
        <span>
         <strong>{question.anime.anime_name}</strong>
        </span><br />
         {question.question}
      </p>
    </div>
  )
}

export default Contribution