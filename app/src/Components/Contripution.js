import { useContext, useState, useEffect,useRef } from "react"
import { ServerContext } from "../App"
import getCookie from "../GetCookie"

const Contripution = () => {
  const {server} = useContext(ServerContext)  
  const CsrfToken = getCookie('csrftoken')

  const [animesoptions,setanimesoptions] = useState()
  
  
  //load all animes:

   const GetAllAnimes =async ()=>
   {
     const res = await fetch(`${server}/home/animesoptions`)
     const animes  = await res.json()
     setanimesoptions(animes)
   }

  

  const [Question,setQuestion] = useState({
    question:"",
    rightanswer:"",
    choice1:"",
    choice2:"",
    choice3:"",
  })

  const[anime,setanime]= useState()

  const firstinput = useRef(null)

  const handlechange = (e)=>
  {
    const {name,value} = e.target
    setQuestion(prev => ({...prev, [name]: value}))
  }

  const handleselect=(e)=> {setanime(e.target.value)}

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
        console.log(res)
    
        // after waiting for submission now we can clear the states 
        for (const key in Question)
          setQuestion(prev => ({...prev,[key]:""}))
      }
      

     anime&& anime!=="choose an anime" && SendContribution()
  }


  
  useEffect(()=>{ 
    firstinput.current.focus()
    GetAllAnimes()
  },[])


 

  


  return (
    <div>
      <h1>contribute a quesion </h1>

      <form onSubmit={HandleSubmision} >
        
      <select onChange={handleselect} id="pet-select" >

        <option>choose an anime</option>
        
          {animesoptions&&animesoptions.map((anime,index)=>(
          <option value={anime.id} key={index}>{anime.anime_name}</option>))}

      </select>

  

      <br />
      <label>
        Question 
        <input type="text"  ref={firstinput}
        value={Question.question}
        onChange={handlechange}
        autoComplete="off"
        name="question" required/>
      </label><br />


      <label>
        Right Answer
        <input type="text"  
        value={Question.rightanswer}
        onChange={handlechange}
        name="rightanswer" 
        autoComplete="off" required/>
      </label><br />
      <hr />
      <h2>choices: </h2>
      <label>
         choice 1
        <input type="text"
        value={Question.choice1}
        onChange={handlechange}
        name="choice1"
        autoComplete="off" required/>
      </label><br />

      <label>
      choice 2
        <input type="text"   
        value={Question.choice2}
        onChange={handlechange}
        name="choice2"
        autoComplete="off" required/>
      </label><br />


      <label>
      choice 3
        <input type="text"  
        value={Question.choice3}
        onChange={handlechange}
        name="choice3"
        autoComplete="off" required/>
      </label><br />


      <input type="submit" value="Submit" />
    </form>
    </div>
  )
}

export default Contripution