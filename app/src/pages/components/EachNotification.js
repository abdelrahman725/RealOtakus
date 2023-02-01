import get_local_date from "./LocalDate"

const EachNotification = ({ notification, kind, time, navigate, get_shown_notification }) => {

  return (
    <div className="pointer_cursor notification" onClick={() => navigate(kind, notification)}>
      {get_shown_notification(notification, kind)}
      <p className="notification_time">{get_local_date(time, true)} </p>
    </div>
  )
}

export default EachNotification