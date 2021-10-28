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

<TableContainer 
component={Paper} className="TableContainer">
      <Table >
        <TableHead style={{backgroundColor:"royalblue"}}>
            <TableRow>
                <TableCell style={{color:"white"}}>Name</TableCell>
                <TableCell style={{color:"white"}}>Country</TableCell>
                <TableCell style={{color:"white"}}>Score</TableCell>
                <TableCell style={{color:"white"}}>Level</TableCell>
            </TableRow>
        </TableHead>

        <TableBody>
          {otakus.map((otaku) => (
            <TableRow
              key={otaku.id}>
              <TableCell component="th" scope="row">
                {otaku.username}
              </TableCell>
              <TableCell >{"Egypt"}</TableCell>
              <TableCell >{otaku.points}</TableCell>
              <TableCell >{otaku.level}</TableCell>
 
       
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </div>
  )
}
export default LeaderBoard;
