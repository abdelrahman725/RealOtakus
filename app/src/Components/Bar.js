const Bar = ({data,show}) => {

  return (
    <div className="bar">
      <div>{data.level}</div>
      <div>{data.points}</div>
      <div onClick={ ()=> show("notifications")} className="notifications">activity</div>
      <div onClick={ ()=> show("profile") } className="profilename">{data.username}</div>
    </div>
  )
}

export default Bar