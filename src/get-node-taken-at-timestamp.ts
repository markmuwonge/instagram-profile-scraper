const helperFunctions = require("./helper-functions")

export default function getNodeTakenAtTimestamp(node:any){
    let takenAtTimeStamp = ""
    try{
        takenAtTimeStamp = node.taken_at_timestamp
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting taken at time stamp from node: ${e}`)
    }
    return takenAtTimeStamp
}