const helperFunctions = require("./helper-functions")

export default function getNodeCommentCount(node:any){
    let commentCount = 0
    try{
        commentCount = node.edge_media_to_comment.count
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting comment count from node: ${e}`)

    }
    return commentCount
}