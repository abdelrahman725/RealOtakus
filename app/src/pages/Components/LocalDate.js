
// 1.convert utc time (fetched from the server) to browser local time
// 2.convert the 24 hours format to am/pm format with a popular format
const UtcToLocalTime = (utc_time)=>{
        
    const date_time = new Date(utc_time)
    
    const months_names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
   
    const notification_year = date_time.getFullYear()
    const current_year = new Date().getFullYear()
    
    const date = `${months_names[date_time.getMonth()]} ${date_time.getDate()}${notification_year !== current_year ? ', ' + notification_year:''}`
    
    const time = date_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    return `${date} at ${time}`
   
}

export default UtcToLocalTime
