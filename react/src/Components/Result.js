import {CircularProgress,Box} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
const Result = ({score,NumberOfQuestions,passed,loading,highest_score})=>
{
  
  const ScorePercentage = Math.round((score/NumberOfQuestions)*100)
  
  return(
    <div className="ResultView">
      
      {loading ? 

          <Box sx={{ display: 'flex' ,flexDirection: 'column'}}>
           <CircularProgress />
            <p>{"fetching your result"}</p>
          </Box>
       :
       <div className="Result">
            
            {score > highest_score&&<div className="NewScore">
            <Alert severity="info"  variant="filled"> new High Score  </Alert>
              </div>}
              
           
            <div className="Resultmsg" style={{backgroundColor:passed?"green":"#b7410e"}}>
              {passed? ScorePercentage===100?"Perfect !":"Congratulations you passed !":"sorry you failed the quiz"}
              <div className="Score">
                {ScorePercentage+"%"}
              </div>
            </div>
       

          {passed&& <div className="Points">
              {"you have earned " +score+ " points"}
            </div>}
          
       </div>

    }
    </div>
  )
}
export default Result
