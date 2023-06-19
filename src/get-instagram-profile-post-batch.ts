const helperFunctions = require("./helper-functions")

export function getInstagramProfilePostBatch(objectResponseBody: any, includeProfileId: boolean) {
    helperFunctions.getLoggerInstance().info("Getting instagram profile post batch")
    let postBatch:any = undefined

    try {
        const user = objectResponseBody.data.user
        const edgeOwnerToTimelineMedia = user.edge_owner_to_timeline_media;

        const userId: string = includeProfileId ? user.id : undefined //profile_id
        const totalProfilePosts: number = edgeOwnerToTimelineMedia.count //total_profile_posts
        const subsequentBatchesAvailable: boolean = edgeOwnerToTimelineMedia.page_info.has_next_page //subsequent_batches_available
        const endCursor: string = edgeOwnerToTimelineMedia.page_info.end_cursor //end_cursor
        const posts: any[] = edgeOwnerToTimelineMedia.edges.map((edge: any) => {
            return edge.node
        })
        .map((node: any) => {
                const typeName = node.__typename
                if (typeName === "GraphImage") {
                    // return graphImageNodeInfoRetriever.retrieve("jsonObject", "edge_owner_to_timeline_media", node);
                }
                else if (typeName === "GraphVideo") {
                    // return graphVideoNodeInfoRetriever.retrieve("jsonObject", "edge_owner_to_timeline_media", node);
                }
                else if (typeName === "GraphSidecar") {
                    // return graphSidecarNodeInfoRetriever.retrieve("jsonObject", "edge_owner_to_timeline_media", node);
                }
                else {
                    return undefined;
                }
            })
        .filter((nodeInfo: any) => nodeInfo !== undefined)
        postBatch = {}
        if (userId) postBatch.profile_id = userId
        postBatch.total_profile_posts = totalProfilePosts
        postBatch.subsequent_batches_available = subsequentBatchesAvailable
        postBatch.end_cursor = endCursor
        postBatch.posts = posts
    } catch (e) {
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting instagram profile post batch: ${e}`)
    }
    finally {
        helperFunctions.getLoggerInstance().info(`Instagram profile post batch retrieved: ${postBatch !== undefined ? "YES" : "NO"}`)

    }
    return postBatch
}