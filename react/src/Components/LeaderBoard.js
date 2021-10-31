import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'

import Countries from '../countries.json'

const LeaderBoard = ({otakus,username})=>
{
  


  return(
  <div className="TablesContainer">

<TableContainer 
component={Paper} className="Table">
      <Table>
        <TableHead className="TableHead">
            <TableRow>
                <TableCell style={{color:"white"}}>Name</TableCell>
                <TableCell style={{color:"white"}}>Country</TableCell>
                <TableCell style={{color:"white"}}>Score</TableCell>
                <TableCell style={{color:"white"}}>Level</TableCell>
                <TableCell style={{color:"white"}}>right answers</TableCell>
            </TableRow>
        </TableHead>

        <TableBody>
          {otakus.map((otaku,index) => (otaku.country&&
              <TableRow key={otaku.id} 
              
              style={{backgroundColor:otaku.username===username&&"#B7E9F7"}}>
                  <TableCell component="th" scope="row">
                  {index+1}.&nbsp;&nbsp;{otaku.username}
                  </TableCell>
                  <TableCell >
                    
                  <img
                  src={`https://flagcdn.com/120x90/${otaku.country}.png`}
                  width="27"
                  alt={Countries[otaku.country]}/>
                    </TableCell>
                  <TableCell ><strong>{otaku.points}</strong></TableCell>
                  <TableCell >{otaku.level}</TableCell>
                  <TableCell >{Math.round((otaku.points/(otaku.TestsCount*20))*100)+" %"}</TableCell>       
              </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>




    <TableContainer 
component={Paper} className="Table">
      <Table >
        <TableHead className="TableHead">
            <TableRow>
                <TableCell style={{color:"white"}}>Anime</TableCell>
                <TableCell style={{color:"white"}}>answered correctly</TableCell>
            </TableRow>
        </TableHead>

        <TableBody>
            <TableRow>
              <TableCell component="th" scope="row"> {"death note"} </TableCell>
              <TableCell >{30}</TableCell>     
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}
export default LeaderBoard;
