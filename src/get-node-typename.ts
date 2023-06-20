const helperFunctions = require("./helper-functions")

export default function getNodeTypename(node:any){
    let typename = ""
    try{
        typename = node.__typename
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting typename from node: ${e}`)

    }
    return typename
}