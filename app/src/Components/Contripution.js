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
  //const [contributionGuide,setcontributionGuide] = useState()

  const [Question,setQuestion] = useState({
    question:"",
    rightanswer:"",
    choice1:"",
    choice2:"",
    choice3:"",
  })
  
  const[anime,setanime]= useState()
  
  const input_2 = useRef(null)
  const input_3 = useRef(null)
  const input_4 = useRef(null)
  const input_5 = useRef(null)
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

    if (value[value.length-1]==="\n")
    {
      name === "question"&&input_2.current.focus()
      name === "rightanswer"&&input_3.current.focus()
      name === "choice1"&&input_4.current.focus()
      name === "choice2"&&input_5.current.focus()
      name === "choice3"&&submit_btn.current.focus()
      return 
    }
      // e.nativeEvent.inputType === "insertLineBreak" 
    
    setQuestion(prev => ({...prev, [name]: value}))
  }

  
  const HandleSubmision = (e)=>
  {
      e.preventDefault() 

      // submit the form here : 

      const SendContribution = async()=>
      {
        
        const send = await fetch(`${server}/home/contribute`,{
    
          method : 'POST',
          headers : {
            'Content-type': 'application/json',
            'X-CSRFToken': CsrfToken,
          },
          body: JSON.stringify({
            question:Question,
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
          return false;
        }
    
    // removes leading and trailing spaces (before checking for duplicates)
       const unique_choices = new Set()  
       for (const key in Question)
          key!=="question"&& unique_choices.add(Question[key].trim())
        
  
        if (unique_choices.size !==4)
        {
          console.log("each choice must be unique")
          return false
        }  

        document.activeElement.blur()
        SendContribution()
      }

      // checking first if the contribution form is valid before submit
      Validate_and_SubmitForm()

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

        <Select options={animesoptions} className="select_animes"  placeholder="select anime" 
        onChange={handleselect} ref={select_animes}/>
        
        <br/> <br/>

       <textarea name="question" 
        typeof="text"
        placeholder = "what is the question?" 
        cols="30" rows="3" 
        maxLength="350" minLength="10"
        required 
        value={Question.question}
        onChange={handlechange} 
        >
       </textarea><br />

       <textarea name="rightanswer"
        typeof="text" 
        placeholder = "right answer"
        cols="30" rows="3"
        maxLength="150" minLength="1"
        required 
        value={Question.rightanswer} ref={input_2} 
        onChange={handlechange} 
        >
       </textarea><br />
  

     <h3>choices<span> (wrong answers) </span></h3>
   
       <textarea name="choice1" 
        typeof="text" 
        placeholder = "choice 1"
        cols="30" rows="3" 
        maxLength="150" minLength="1"
        required 
        value={Question.choice1} ref={input_3}
        onChange={handlechange}
        >
       </textarea><br />
    
       <textarea name="choice2"
        typeof="text"
        placeholder = "choice 2"
        cols="30" rows="3" 
        maxLength="150" minLength="1"
        required 
        value={Question.choice2} ref={input_4}
        onChange={handlechange}  
        >
       </textarea><br />
    
       <textarea name="choice3" 
        typeof="text"
        placeholder = "choice 3"
        cols="30" rows="3" 
        maxLength="150" minLength="1"
        required 
        value={Question.choice3} ref={input_5}
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