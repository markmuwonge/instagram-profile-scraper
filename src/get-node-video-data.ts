const helperFunctions = require("./helper-functions")

export default function getNodeVideoData(node:any){
    let videoData:any = {}
    try{
        const videoUrl = node.video_url
        const mimeType = "video/mp4"
        const videoThumbnailUrl = node.display_url

        videoData.video_url = videoUrl
        videoData.mime_Type = mimeType
        videoData.video_thumbnail_url = videoThumbnailUrl 
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting video data from node: ${e}`)

    }
    return videoData
}