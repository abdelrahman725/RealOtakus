import Notifications from "./Notifications"
const Bar = ({data}) => {
  return (
    <>
    <h1>welcome {data.username}</h1>
    <strong>{data.points} points</strong>
    <br />
    </>
  )
}

export default Bar