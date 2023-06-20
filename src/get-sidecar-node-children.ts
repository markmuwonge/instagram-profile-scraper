const helperFunctions = require("./helper-functions")

const getGraphImageNodeInfo = require("./get-graph-image-node-info")
const getGraphVideoNodeInfo = require("./get-graph-video-node-info")

export default function getSidecarNodeChildren(node:any, responseBodyType:string){
    let children:any = []
    try{
        children = node.edge_sidecar_to_children.edges
        .map((edge:any) => edge.node)
        .map((node:any) => {
            const typename = require("./get-node-typename").default(node)
            if (typename === "GraphImage") {
                return getGraphImageNodeInfo.default(responseBodyType, "edge_sidecar_to_children", node);
            }
            else if (typename === "GraphVideo") {
                return getGraphVideoNodeInfo.default(responseBodyType, "edge_sidecar_to_children", node);
            }
            else {
                return undefined;
            }
        })
        .filter((node:any) => node !== undefined) 
    }catch(e){
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting sidecar node children from node: ${e}`)
    }
    return children
}