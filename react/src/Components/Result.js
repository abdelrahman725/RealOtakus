const Result = ({score,NumberOfQuestions})=>
{
  return(
    <div className="Result">
        <h3>
          you scored {Math.round(score/NumberOfQuestions *100)} %
        </h3>
        <h4>
          + {score} points
        </h4>
    </div>
  )
}
export default Result
