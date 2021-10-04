import EachQuestion from './EachQuestion'

const Test = ({test_questions})=>
{
  return(

<div className="Questions">
  <hr/>
  your questions based on the choosen animes : 
 

 {test_questions.map( (q) =>(
   <EachQuestion key={q.id}
   question_content = {q.question}
   advanced= {q.advanced}
   choice1 = {q.choice1}
   choice2 = {q.choice2}
   choice3 = {q.choice3}
   right_answer = {q.right_answer}
   />
 ))}
 <hr/>
</div>
  )

}

export default Test