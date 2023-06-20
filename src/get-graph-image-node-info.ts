const helperFunctions = require("./helper-functions")

export default function getGraphImageNodeInfo(responseBodyType: string, nodeGreatGrandParentType: string, node: any) {
    helperFunctions.getLoggerInstance().info("Getting graph image node info")
    let graphImageNodeInfo: any = {}

    try {
        graphImageNodeInfo.type_name = require("./get-node-typename").default(node)

        if (nodeGreatGrandParentType === "edge_owner_to_timeline_media") {
            graphImageNodeInfo.taken_at_time_stamp = require("./get-node-taken-at-timestamp").default(node)
            graphImageNodeInfo.like_count = require("./get-node-like-count").default(node, responseBodyType)
            graphImageNodeInfo.comment_count = require("./get-node-comment-count").default(node)
            graphImageNodeInfo.caption = require("./get-node-caption").default(node)
            graphImageNodeInfo.post_url = require("./get-node-post-url").default(node)
            graphImageNodeInfo.username = require("./get-node-username").default(node)
        }
        
        graphImageNodeInfo.display_url = require("./get-node-display-url").default(node)
    }
    finally {
        helperFunctions.getLoggerInstance().info(`Graph image node info retrieved: ${graphImageNodeInfo !== undefined ? JSON.stringify(graphImageNodeInfo) : "NO"}`)
    }
    return graphImageNodeInfo
}   