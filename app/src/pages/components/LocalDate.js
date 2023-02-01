
// 1.convert utc time (fetched from the server) to browser local time
// 2.convert the 24 hours format to am/pm format with a popular format
const months_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const get_local_date = (utc_time, include_time = false) => {

    const date_time = new Date(utc_time)

    const notification_year = date_time.getFullYear()
    const current_year = new Date().getFullYear()

    // omit year from date if it's the current year (for convention)
    const date = `${months_names[date_time.getMonth()]} ${date_time.getDate()}${notification_year !== current_year ? ', ' + notification_year : ''}`

    if (include_time) {
        const time = date_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        return `${date} at ${time}`
    }
    return date

}

export default get_local_date
