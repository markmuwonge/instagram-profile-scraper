const helperFunctions = require("./helper-functions")
const constants = require("./constants")


export default function getNodePostUrl(node:any){
    let postUrl = ""
    try{
        postUrl = constants.INSTAGRAM_POST_URL_STRUCTURE.replace("[SHORTCODE]", node.shortcode)
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting post url from node: ${e}`)

    }
    return postUrl
}