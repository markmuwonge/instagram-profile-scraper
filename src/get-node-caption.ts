const helperFunctions = require("./helper-functions")

export default function getNodeCaption(node: any) {
    let caption = ""
    try {
        caption = function () {
            const edges = node.edge_media_to_caption.edges
            if (edges.length === 0) return ""
            return edges[0].node.text
        }()
    } catch (e) {
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting caption from node: ${e}`)

    }
    return caption
}