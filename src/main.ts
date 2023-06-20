
const constants = require("./constants");
const helperFunctions = require("./helper-functions");
const makeGetRequest = require("./make-get-request");
const getInstagramProfilePostBatch = require("./get-instagram-profile-post-batch")
const jsonPrune = require("json-prune");

(async function () {

    const set = await require("./global").default()
    if (!set) {
        return
    }

    const config = helperFunctions.getConfig();
    if (config.latest_x_posts <= 0) {
        return
    }

    let requestConfig = require("./get-request-config").default(config.cookies)

    let response = await makeGetRequest.default(constants.INSTAGRAM_HOME_URL + "/" + config.instagram_handle, requestConfig);
    if (response === undefined) return
    let responseBody = response.data

    const csrfToken = require("./get-csrf-token").default(responseBody)
    if (csrfToken === undefined) return

    const appId = require("./get-app-id").default(responseBody)
    if (appId === undefined) return
    requestConfig = require("./get-request-config").default(config.cookies, {
        'x-csrftoken': csrfToken,
        'x-ig-app-id': appId
    })

    const instagramProfileSearchUrl = new URL(constants.INSTAGRAM_PROFILE_SEARCH_URL);
    instagramProfileSearchUrl.searchParams.append("username", config.instagram_handle);

    response = await makeGetRequest.default(instagramProfileSearchUrl.href, requestConfig);
    if (response === undefined) return
    responseBody = response.data
    if (typeof responseBody !== "object") return

    const instagramPostInfos: any[] = []
    const instagramProfilePostBatches = []
    let postsCollected = 0

    const initialInstagramProfilePostBatch = getInstagramProfilePostBatch.getInstagramProfilePostBatch(responseBody, true)
    if (initialInstagramProfilePostBatch === undefined) {
        require("fs").writeFileSync(config.output_file_location, jsonPrune(instagramPostInfos))
        return
    }
    instagramProfilePostBatches.push(initialInstagramProfilePostBatch)
    postsCollected += initialInstagramProfilePostBatch.posts.length;

    for (
        let lastInstagramProfilePostBatch = initialInstagramProfilePostBatch;
        postsCollected < config.latest_x_posts && initialInstagramProfilePostBatch.subsequent_batches_available;
        lastInstagramProfilePostBatch = instagramProfilePostBatches[instagramProfilePostBatches.length - 1]
    ) {
        const instagramProfileSearchUrl = new URL(constants.INSTAGRAM_HOME_URL + "/" + "graphql/query/");
        instagramProfileSearchUrl.searchParams.append("query_hash", constants.INSTAGRAM_POST_PAGINATION_QUERY_HASH);
        instagramProfileSearchUrl.searchParams.append("variables", JSON.stringify({
            id: initialInstagramProfilePostBatch.profile_id,
            first: 12,
            after: lastInstagramProfilePostBatch.end_cursor
        }));

        response = await makeGetRequest.default(instagramProfileSearchUrl.href, requestConfig);
        if (response === undefined) break;
        responseBody = response.data
        if (typeof responseBody !== "object") break;
        const instagramProfilePostBatch = getInstagramProfilePostBatch.getInstagramProfilePostBatch(responseBody, false)
        if(instagramProfilePostBatch === undefined) break;
        instagramProfilePostBatches.push(instagramProfilePostBatch)
        postsCollected += instagramProfilePostBatch.posts.length;
    }

    instagramProfilePostBatches
    .map((instagramProfilePostBatch) => instagramProfilePostBatch.posts)
    .flat()
    .slice(0, config.latest_x_posts)
    .forEach((instagramPostInfo:any) => instagramPostInfos.push((instagramPostInfo)))
    
    require("fs").writeFileSync(config.output_file_location, jsonPrune(instagramPostInfos))

    helperFunctions.getLoggerInstance().info(`Done`)

})()
//npx tsc; node .\dist\main.js

