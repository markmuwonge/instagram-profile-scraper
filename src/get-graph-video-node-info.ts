const helperFunctions = require("./helper-functions")

export default function getGraphVideoNodeInfo(responseBodyType: string, nodeGreatGrandParentType: string, node: any) {
    helperFunctions.getLoggerInstance().info("Getting graph video node info")
    let graphVideoNodeInfo: any = {}

    try {
        
        graphVideoNodeInfo.type_name = require("./get-node-typename").default(node)

        if (nodeGreatGrandParentType === "edge_owner_to_timeline_media") {
            graphVideoNodeInfo.taken_at_time_stamp = require("./get-node-taken-at-timestamp").default(node)
            graphVideoNodeInfo.like_count = require("./get-node-like-count").default(node, responseBodyType)
            graphVideoNodeInfo.comment_count = require("./get-node-comment-count").default(node)
            graphVideoNodeInfo.caption = require("./get-node-caption").default(node)
            graphVideoNodeInfo.username = require("./get-node-username").default(node)
        }

        graphVideoNodeInfo.post_url = require("./get-node-post-url").default(node)
        graphVideoNodeInfo.video_data = require("./get-node-video-data").default(node)
    }
    finally {
        helperFunctions.getLoggerInstance().info(`Graph video node info retrieved: ${graphVideoNodeInfo !== undefined ? require("json-prune")(graphVideoNodeInfo) : "NO"}`)

    }
    return graphVideoNodeInfo
}   