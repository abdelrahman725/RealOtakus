import Message from "./Message"
import { useContext, useState, useEffect,useRef } from "react"
import { ServerContext } from "../App"
import getCookie from "../GetCookie"
import Select from 'react-select'

const Contripution = () => {

  const {server} = useContext(ServerContext)  
  const CsrfToken = getCookie('csrftoken')
  const [animesoptions,setanimesoptions] = useState()
  const [msg,setmsg] = useState()
  const [contributionGuide,setcontributionGuide] = useState()
  


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

      if (anime!==undefined){        
        document.activeElement.blur() 
        SendContribution()
      }

      else{
        select_animes.current.focus()  
      }
  }

 

  useEffect(()=>{ 
    GetAllAnimes()
  },[])



  return (
    <div className="container contribution">
      <h1>contribute a quesion </h1>
        <h3>please read instructions below, to avoid your questions getting rejected</h3>
      
   
      <br />
      {msg&&<Message msg={msg}/>}
      <form onSubmit={HandleSubmision} >
        
        <div className="form_elements">

        <Select options={animesoptions} className="select_animes"  placeholder="select anime" 
        onChange={handleselect} ref={select_animes}/>
        
        <br /><br />


     <textarea name="question" cols="30" rows="3" typeof="text" maxLength="300"
     value={Question.question}
       onChange={handlechange}  
        required placeholder="what is the question?" >
       </textarea><br />

     <textarea name="rightanswer" cols="30" rows="3" typeof="text" maxLength="150"
     value={Question.rightanswer} ref={input_2} 
     onChange={handlechange} required placeholder="right answer">
       </textarea><br />
  

     <h3>choices<span> (wrong answers)</span></h3>

   

       <textarea name="choice1" cols="30" rows="3" typeof="text" maxLength="150"
        value={Question.choice1} ref={input_3}
        onChange={handlechange} 
        required placeholder="choice 1">
       </textarea><br />
    
       <textarea name="choice2" cols="30" rows="3" typeof="text" maxLength="150"
        value={Question.choice2}  ref={input_4}
        onChange={handlechange} 
       required placeholder="choice 2">
       </textarea><br />
    
       <textarea name="choice3" cols="30" rows="3" typeof="text" maxLength="150"
       value={Question.choice3}  ref={input_5}
        onChange={handlechange} 
       required placeholder="choice 3">
       </textarea><br />

      <br />
      <button type="submit" ref={submit_btn}>submit question </button>


      </div>
    </form>
    </div>
  )
}

export default Contripution