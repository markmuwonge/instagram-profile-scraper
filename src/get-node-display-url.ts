const helperFunctions = require("./helper-functions")

export default function getNodeDisplayUrl(node:any){
    let displayUrl = ""
    try{
        displayUrl = node.display_url
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting dispaly url from node: ${e}`)

    }
    return displayUrl
}