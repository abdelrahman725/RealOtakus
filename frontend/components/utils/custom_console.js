export default function ConsoleLog(msg) {
    if (process.env.NODE_ENV === "production") {
        return
    }
    console.log(msg)
}