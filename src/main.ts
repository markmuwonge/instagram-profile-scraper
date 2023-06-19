
const constants = require("./constants");
const helperFunctions = require("./helper-functions");
const makeGetRequest = require("./make-get-request");
const getInstagramProfilePostBatch = require("./get-instagram-profile-post-batch")

const instagramPostInfos = [];

(async function () {
    const set = await require("./global").default()
    if (!set) {
        return
    }
    

    const config = helperFunctions.getConfig();
    if (config.latest_x_posts <= 0){
        return
    }

    let requestConfig = require("./get-request-config").default(config.cookies)

    // const response = await makeGetRequest.default(constants.INSTAGRAM_HOME_URL + "/" + config.instagram_handle, requestConfig);
    // if (response === undefined) return
    // const responseBody = response.data
    let responseBody = require("fs").readFileSync("", "utf8");

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

    const response = await makeGetRequest.default(instagramProfileSearchUrl.href, requestConfig);
    if (response === undefined) return
    responseBody = response.data
    if (typeof responseBody !== "object") return
    
    const initialInstagramProfilePostBatch = getInstagramProfilePostBatch.getInstagramProfilePostBatch(responseBody, true)
    if (initialInstagramProfilePostBatch === undefined){
        // instagramPostInfos
        return
    }

    console.log(initialInstagramProfilePostBatch)
    
    // if (typeof )
    // console.log(responseBody)

  
    // require("fs").writeFileSync("./delete.txt", responseBody)


})()
//npx tsc; node .\dist\main.js

