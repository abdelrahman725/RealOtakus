export default function get_notification_content(notification_or_anime_name, kind) {

    if (!kind) {
        return (
            <p>{notification_or_anime_name}</p>
        )
    }

    if (kind === "NA") {
        return (
            <p>
                <strong>{notification_or_anime_name}</strong> is now available in Quizes!
            </p>
        )
    }

    if (kind === "N") {
        return (
            <p>
                Congratulations! you are now a reviewer of <strong>{notification_or_anime_name}</strong>, please note that
                your own contributions for <strong>{notification_or_anime_name}</strong> still need to be reviewed by other reviewers
            </p>
        )
    }

    if (kind === "R") {
        return (
            <p>
                New contributed question for <strong>{notification_or_anime_name}</strong>
            </p>
        )
    }

    if (kind === "A1") {
        return (
            <p>
                Congratulations you are now a contributor ! <br />
                your contribution for <strong>{notification_or_anime_name}</strong> is approved, +10 points
            </p>
        )
    }

    if (kind === "A") {
        return (
            <p>
                Congratulations ! your contribution for <strong>{notification_or_anime_name}</strong> is approved, +10 points
            </p>
        )
    }

    if (kind === "F") {
        return (
            <p>
                Sorry your last contribution for <strong>{notification_or_anime_name}</strong> is rejected
            </p>
        )
    }
}
