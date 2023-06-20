const helperFunctions = require("./helper-functions")

export default function getNodeLikeCount(node:any, responseBodyType:string){
    let likeCount = 0
    try{
        likeCount = responseBodyType === "document" ?
        node.edge_liked_by.count :
        (responseBodyType === "objectResponseBody" ? node.edge_media_preview_like.count : 0)
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting like count from node: ${e}`)

    }
    return likeCount
}