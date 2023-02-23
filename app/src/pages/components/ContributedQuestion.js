import get_local_date from "./LocalDate"
const ContributedQuestion = ({ contribution, feedback_value_to_label }) => {

  return (
    <div className={`user_contributed_question ${contribution.approved === true ? "approvestate" : contribution.approved === false ? "declinestate" : "pendingstate"}`}>
      <p><strong>{contribution.question.anime.anime_name}</strong></p>
      <p>{contribution.question.question}</p>
      <div className="choices">
        <p className="right_answer">{contribution.question.right_answer}</p>
        <p>{contribution.question.choice1}</p>
        <p>{contribution.question.choice2}</p>
        <p>{contribution.question.choice3}</p>
      </div>
      {contribution.approved === false && <p>feedback : <strong>{feedback_value_to_label[contribution.feedback]}</strong></p>}
      <p className="date_created">{get_local_date(contribution.date_created)}</p>
    </div>
  )
}

export default ContributedQuestion