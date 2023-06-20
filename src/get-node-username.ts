const helperFunctions = require("./helper-functions")

export default function getNodeUsername(node:any){
    let username = ""
    try{
        username = node.owner.username
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting username from node: ${e}`)

    }
    return username
}