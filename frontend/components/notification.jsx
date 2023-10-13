
import get_local_date from "./utils/localdate"
import get_notification_content from "./utils/notification_content";

export default function Notification({ notification_data, navigate }) {
    return (
        <div className="pointer_cursor notification" onClick={() => navigate(notification_data.kind)}>
            {get_notification_content(notification_data.notification, notification_data.kind)}
            <p className="notification_time">{get_local_date(notification_data.time, true)} </p>
        </div >
    )
}