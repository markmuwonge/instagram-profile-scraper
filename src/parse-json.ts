const helperFunctions = require("./helper-functions")
export default function parseJSON(json: string) {

    let obj = undefined
    try {
        obj = JSON.parse(json)
    } catch (e) {
        helperFunctions.getLoggerInstance().error(`Error attempting to parse json '${json}': ${e}`)
    }
    return obj
}
