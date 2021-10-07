import EachQuestion from './EachQuestion'

const random = ()=>
{
  return Math.floor(Math.random() * 4)+1
}


const  Test = ({test_questions})=>
{

return(
<div className="Questions">
<h3>

  your questions based on the choosen animes : 
</h3>
 <hr/>

 {test_questions.map( (q) =>
 (
   
   <EachQuestion key={q.id}
   R= {random()}
   counter = {test_questions.indexOf(q)+1}
   question_content = {q.question}
    id = {q.id}
   advanced= {q.advanced}
   choice1 = {q.choice1}
   choice2 = {q.choice2}
   choice3 = {q.choice3}
   right_answer = {q.right_answer}
   />
 ))}

</div>
  )

}

export default Test