import Message from "./Message"
import { useContext, useState, useEffect, useRef } from "react"
import { ServerContext } from "../App"
import getCookie from "../GetCookie"
import Select from 'react-select'

const Contripution = () => {

  const {server} = useContext(ServerContext)  
  const CsrfToken = getCookie('csrftoken')
  const [animesoptions,setanimesoptions] = useState()

  const [msg,setmsg] = useState()
  
  // ensure
  const  letters_exist = /[a-z]/ig
  // reject
  const  leading_space = /^\s/
  const  extra_space = /\s{2,}/
  const  excluded_symbols = /[#`~@\^\*\|\\]/

  const [Question,setQuestion] = useState({
    question:"",
    rightanswer:"",
    choice1:"",
    choice2:"",
    choice3:"",
  })
  
  const[anime,setanime]= useState()  
  
  const question_ref = useRef(null)
  const submit_btn = useRef(null)

  const select_animes = useRef(null)

  const GetAllAnimes =async ()=>
   {
     const res = await fetch(`${server}/home/animesoptions`)
     const animes  = await res.json()
     const anime_array = []
      animes.map((anime) => 
      anime_array.push({value:anime.id,label:anime.anime_name})
      )

     setanimesoptions(anime_array)

   }  

  const handleselect=(e)=> {setanime(e.value)}


  const handlechange = (e)=>
  {    

    const{name,value} = e.target
    if (value.match(leading_space) != null ||
        value.match(extra_space) != null   ||
        value.match(excluded_symbols) != null
    ) {
      console.log("this input is not allowed")
      return
    }
   
      
    setQuestion(prev => ({...prev, [name]: value}))
  }

  
  const HandleSubmision = (e)=>
  {
      e.preventDefault() 

      // submit the form here : 

      const SendContribution = async(cleaned_question)=>
      {
        
        const send = await fetch(`${server}/home/contribute`,{
    
          method : 'POST',
          headers : {
            'Content-type': 'application/json',
            'X-CSRFToken': CsrfToken,
          },
          body: JSON.stringify({
            question:cleaned_question,
            anime:anime
          })
        })
        const res  = await send.json()
    
        // after waiting for submission now we can clear the states 
        for (const key in Question)
          setQuestion(prev => ({...prev,[key]:""}))

        setmsg(res.message)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      

      const Validate_and_SubmitForm =()=>{
    
        if (anime ===undefined || anime==="")
        {
          select_animes.current.focus(); 
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return false;
        }
        
        const cleaned_question = {
          question:"",
          rightanswer:"",
          choice1:"",
          choice2:"",
          choice3:"",
        }

    
    // removes leading and trailing spaces (for duplication checking and for form submission)
        const unique_choices = new Set()  
        for (const key in Question)
        { 
          const trimmed_value = Question[key].trim()
          key!=="question"&& unique_choices.add(trimmed_value)
          cleaned_question[key] = trimmed_value
        }
          
        if ( 
          cleaned_question.question.match(letters_exist) == null 
          ||
          cleaned_question.question.match(letters_exist).length < 2
         )
         {
          console.log("question shoud contain at least 2 letters")
          question_ref.current.focus() 
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return false
        }
        
        if (cleaned_question.question.length < 10)
        {
           console.log("question must be at least 10 characters length")
           question_ref.current.focus() 
           window.scrollTo({ top: 0, behavior: 'smooth' })
           return false
         }
        

        if (unique_choices.size !==4)
        {
          console.log("each choice must be unique")
          return false
        }  

        document.activeElement.blur()
        SendContribution(cleaned_question)
      }

      // checking first if the contribution form is valid before submit
      Validate_and_SubmitForm()
      //SendContribution(Question)

  }

  
  useEffect(()=>{ 
    GetAllAnimes()
  },[])


  return (
    <div className="container contribution">
      <h1>contribute a quesion </h1>
         
      <br />
      {msg && <Message msg={msg}/>}
      <form onSubmit={HandleSubmision} >
        
        <div className="form_elements">

        <Select 
        className="select_animes" 
        placeholder="select anime" 
        isLoading={animesoptions?false:true}
        options={animesoptions}
        onChange={handleselect} 
        ref={select_animes}
        />
        
        <br/> <br/>

       <textarea name="question" 
        typeof="text"
        placeholder = "what is the question ?" 
        cols="30" rows="3" 
        maxLength="350" 
        required 
        value={Question.question}
        onChange={handlechange}
        ref={question_ref} 
        >
       </textarea><br />

       <textarea name="rightanswer"
        typeof="text" 
        placeholder = "right answer"
        cols="30" rows="3"
        maxLength="150" 
        required 
        value={Question.rightanswer}  
        onChange={handlechange} 
        >
       </textarea><br />
  

     <h3>choices<span> (wrong answers) </span></h3>
   
       <textarea name="choice1" 
        typeof="text" 
        placeholder = "choice 1"
        cols="30" rows="3" 
        maxLength="150" 
        required 
        value={Question.choice1} 
        onChange={handlechange}
        >
       </textarea><br />
    
       <textarea name="choice2"
        typeof="text"
        placeholder = "choice 2"
        cols="30" rows="3" 
        maxLength="150" 
        required 
        value={Question.choice2} 
        onChange={handlechange}  
        >
       </textarea><br />
    
       <textarea name="choice3" 
        typeof="text"
        placeholder = "choice 3"
        cols="30" rows="3" 
        maxLength="150"
        required 
        value={Question.choice3}
        onChange={handlechange}
        >
       </textarea><br />

      <br />
      <button type="submit" ref={submit_btn}>submit question</button>


      </div>
    </form>
    </div>
  )
}

export default Contripution