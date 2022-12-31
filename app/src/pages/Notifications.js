import EachNotification from "./Components/EachNotification"
import async_http_request from "./Components/AsyncRequest"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Notifications = ({ all_notifications, unseen_count, setnumber_of_unseen_notifications }) => {

  const naviage_routes = useNavigate()

  const notification_kind_to_path = {
    "R": "/review",
    "A": "/mycontributions",
    "F": "/mycontributions"
  }

  const change_route = (kind, filtered_anime) => {
    if (kind === null)
      return

    if (kind === "R") {
      naviage_routes(
        notification_kind_to_path[kind],
        { state: { value: filtered_anime, label: filtered_anime } }
      )
      return
    }

    if (kind === "A" || kind === "F") {
      naviage_routes(
        notification_kind_to_path[kind],
        { state: kind === "A" }
      )
      return
    }

    naviage_routes(notification_kind_to_path[kind])
  }

  useEffect(() => {

    if (unseen_count <= 0)
      return

    // clears unseen_notifcations count when user sees them
    setnumber_of_unseen_notifications(0)

    //update notifications state in the server (which are seen by the user in the  UI) from unseen to seen   
    const unseen_notifications = []

    all_notifications.map((n) =>
      !n.seen && unseen_notifications.push(n.id)
    )

    const update_notifications_state = async () => {

      const notifications_update_state_response = await async_http_request({
        path: "update_notifications",
        method: "PUT",
        data: {
          "notifications": unseen_notifications
        }
      })

      console.log(notifications_update_state_response)
    }

    update_notifications_state()

  }, [all_notifications])

  return (
    <div className="notifications">
      {all_notifications.length > 0 ? all_notifications.map((noti, index) => (
        <EachNotification
          key={index}
          time={noti.time}
          notification={noti.notification}
          kind={noti.kind}
          navigate={change_route}
        />
      )) :
        <p>no activity yet</p>
      }
    </div>
  )
}

export default Notifications