import {CircularProgress,Box} from '@material-ui/core'
const Result = ({score,NumberOfQuestions,passed,loading})=>
{
  
  const ScorePercentage = Math.round((score/NumberOfQuestions)*100)
  
  return(
    <div className="ResultView">
      {loading ? 

          <Box sx={{ display: 'flex' ,flexDirection: 'column'}}>
           <CircularProgress />
          <p>{"submitting"}</p>
          </Box>
       :
       <div className="ResultView">
          <div className="Resultmsg" style={{backgroundColor:passed?"green":"#b7410e"}}>
            {passed? ScorePercentage===100?"Perfect!":"Congratulations you passed !":"sorry you failed"}
          </div>
          <div className="Score">
            {"Score: "+ScorePercentage+" %"}
            {"Poins: +"+score}
          </div>
       </div>

    }
    </div>
  )
}
export default Result
