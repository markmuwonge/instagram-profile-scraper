const helperFunctions = require("./helper-functions")

export default function getGraphSidecarNodeInfo(responseBodyType: string, nodeGreatGrandParentType: string, node: any) {
    helperFunctions.getLoggerInstance().info("Getting graph sidecar node info")
    let graphSidecarNodeInfo: any = {}

    try {

        graphSidecarNodeInfo = {}
        graphSidecarNodeInfo.type_name = require("./get-node-typename").default(node)

        if (nodeGreatGrandParentType === "edge_owner_to_timeline_media") {
            graphSidecarNodeInfo.taken_at_time_stamp = require("./get-node-taken-at-timestamp").default(node)
            graphSidecarNodeInfo.like_count = require("./get-node-like-count").default(node, responseBodyType)
            graphSidecarNodeInfo.comment_count = require("./get-node-comment-count").default(node)
            graphSidecarNodeInfo.caption = require("./get-node-caption").default(node)
            graphSidecarNodeInfo.post_url = require("./get-node-post-url").default(node)
            graphSidecarNodeInfo.username = require("./get-node-username").default(node)
        }

        graphSidecarNodeInfo.children = require("./get-sidecar-node-children")
        .default(node, responseBodyType, "edge_sidecar_to_children")
    }
    finally {
        helperFunctions.getLoggerInstance().info(`Graph sidecar node info retrieved: ${graphSidecarNodeInfo !== undefined ? require("json-prune")(graphSidecarNodeInfo) : "NO"}`)
    }
    return graphSidecarNodeInfo
}   