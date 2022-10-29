import async_http_request from "./Components/AsyncRequest"
import Select from 'react-select'
import {  useState, useRef,useContext, useEffect } from "react"
import { GlobalStates } from "../App"

const Contribute = ({all_animes_options}) => {

  const {set_info_message} = useContext(GlobalStates)
  const [anime,setanime]= useState()  
  
  const question_ref = useRef(null)
  const submit_btn = useRef(null)
  const anime_select = useRef(null)
  const checkbox = useRef(null)
  
  // ensure
  const  letters_exist = /[a-z]/ig
  // reject
  const  leading_space = /^\s+/
  const  extra_space = /\s{2,}/
  const  excluded_symbols = /[#`~@^*|\\]/

  const [Question,setQuestion] = useState({
    question:"",
    rightanswer:"",
    choice1:"",
    choice2:"",
    choice3:"",
  })

  const handle_form_change = (e)=> {    
    const{name,value} = e.target

    if (value.match(leading_space) != null || value.match(extra_space) != null || value.match(excluded_symbols) != null) {
      console.log("this input is not allowed")
      return
    }
    
    setQuestion(prev => ({...prev, [name]: value}))
  }

  const handle_form_submission = (e)=>{
    
      e.preventDefault() 
      
      const SendContribution = async(cleaned_question)=>
      {
        const submit_contribution  = await async_http_request({
          path:"get_make_contribution",
          method:"POST",
          data : {
            "question":cleaned_question,
            "anime":anime.value
          }
        })
        
        set_info_message(submit_contribution.info)
    
      // clear form after submission 
        for (const key in Question)
          setQuestion(prev => ({...prev,[key]:""}))
        
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setanime(null)
        checkbox.current.checked = false
      }
      
      const validate_contribution_form_then_submit =()=>{
        
        if (!anime){
          anime_select.current.focus() 
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
        for (const key in Question){ 
          const trimmed_value = Question[key].trim()
          key!=="question"&& unique_choices.add(trimmed_value)
          cleaned_question[key] = trimmed_value
        }

        const letters_exist_match = cleaned_question.question.match(letters_exist)

        if ( letters_exist_match== null  || letters_exist_match.length < 2){
          console.log("question shoud contain at least 2 letters")
          question_ref.current.focus() 
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return false
        }
        
        if (cleaned_question.question.length < 8){
            console.log("question must be at least 8 characters length")
            question_ref.current.focus() 
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return false
        }
    
        if (unique_choices.size !==4){
          console.log("each choice must be unique")
          return false
        }  

        document.activeElement.blur()
        SendContribution(cleaned_question)
      }

      validate_contribution_form_then_submit()  
  }

  const on_anime_select = (selected_anime)=> {
    setanime(selected_anime) 
    selected_anime && !Question.question && question_ref.current.focus()
    selected_anime &&  anime_select.current.blur()
  }
  
  useEffect(()=>{
    
    if (Question.question){
      window.onbeforeunload = (e)=>{
        return true
      }
    }
    
    return()=>{
      window.onbeforeunload = null
      set_info_message()   
    } 

  },[Question.question])

  return (
    <div className="centered_div contribution">

      <h1>contribute a quesion </h1>
     
      <br />
     
      <form onSubmit={handle_form_submission} >
  
        <div className="contribution_form">

          <Select 
            className="select_animes" 
            placeholder="select anime"
            isClearable= {true}
            isLoading={!all_animes_options}
            options={all_animes_options}
            onChange={on_anime_select} 
            value={anime}
            ref={anime_select}
          />
            
          <br/> <br/>
          
          <textarea name="question" 
            typeof="text"
            placeholder = "what is the question ?" 
            cols="30" rows="3" 
            maxLength="350" 
            required 
            value={Question.question}
            onChange={handle_form_change}
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
            onChange={handle_form_change} 
            >
          </textarea><br />
      
          <h3>choices <span style={{fontWeight:"lighter"}}>(wrong answers)</span> </h3>
      
          <textarea name="choice1" 
            typeof="text" 
            placeholder = "choice 1"
            cols="30" rows="3" 
            maxLength="150" 
            required 
            value={Question.choice1} 
            onChange={handle_form_change}
            >
          </textarea><br />
        
          <textarea name="choice2"
            typeof="text"
            placeholder = "choice 2"
            cols="30" rows="3" 
            maxLength="150" 
            required 
            value={Question.choice2} 
            onChange={handle_form_change}  
            >
          </textarea><br />
        
          <textarea name="choice3" 
            typeof="text"
            placeholder = "choice 3"
            cols="30" rows="3" 
            maxLength="150"
            required 
            value={Question.choice3}
            onChange={handle_form_change}
            >
          </textarea><br />
          
          <input type="checkbox" className="checkbox" name="instructions" ref={checkbox} required/>
          <label htmlFor="instructions"> I understand Contribution Guidlines</label>
          <br /> <br />
          <button type="submit"  className="submit_btn" ref={submit_btn}>submit question</button>

        </div>

      </form>
    
    </div>
  )
}

export default Contribute