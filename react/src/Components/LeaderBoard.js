import Competitor  from "./Competitor"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'


const LeaderBoard = ({otakus})=>
{
  return(
  <div className="LeaderBoard">

<TableContainer style={{margin:"50px"}}
component={Paper} >
      <Table sx={{ minWidth: 550 }} aria-label="simple table">
        <TableHead style={{backgroundColor:"royalblue"}}>
            <TableRow>
                <TableCell style={{color:"white"}}>Name</TableCell>
                <TableCell style={{color:"white"}}>Points</TableCell>
                <TableCell style={{color:"white"}}>Level</TableCell>
                <TableCell style={{color:"white"}}>best anime</TableCell>
            </TableRow>
        </TableHead>

        <TableBody>
          {otakus.map((otaku) => (
            <TableRow
              key={otaku.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {otaku.username}
              </TableCell>
              <TableCell >{otaku.points}</TableCell>
              <TableCell >{otaku.level}</TableCell>
              <TableCell >{"attack on titans"}</TableCell>
       
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>





      
        {/* <table>
          <thead>
            <tr>
              <th>Competitor</th>
              <th>points</th>
              <th>level</th>

            </tr>

          </thead>
          
          <tbody>

              
          {otakus.map( (otaku) =>(
            <Competitor key={otaku.id}
            name = {otaku.username} points = {otaku.points}
            level={otaku.level}
            />
            ))}


         </tbody>
     </table> */}

    </div>
  )
}
export default LeaderBoard;
