const Result = ({score,NumberOfQuestions,passed})=>
{
  return(
    <div className="Result">
     <h3>{passed? `congrats! you answered ${Math.round(score/NumberOfQuestions*100)} % of questions correctly`:` ${Math.round(score/NumberOfQuestions*100)} % , sorry you failed the quiz, you can try again`}</h3>
    </div>
  )
}
export default Result
