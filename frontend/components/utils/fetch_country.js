import ReAuthorizedApiRequest from "./generic_request"
import ConsoleLog from "./custom_console"

export default async function FetchCountry() {

  try {
    const response = await fetch("https://ipapi.co/json/")
    const result = await response.json()

    // after fetching the user country successfully, save it to the db so we don't have to query it again
    if (response.status === 200) {
      ReAuthorizedApiRequest({
        path: "country/",
        method: "POST",
        req_data: { "country": result.country.toLowerCase() }
      })
    }
  }

  catch (error) {
    ConsoleLog(error)
  }
}
