const helperFunctions = require("./helper-functions")
export default function getCsrfToken(responseBody: String) {
    helperFunctions.getLoggerInstance().info("Getting app id from response body")

    let appId = undefined
    try {
        const needle = "customHeaders";
        let index = responseBody.indexOf(needle);
        const substring = responseBody.substring(responseBody.indexOf("{", index), responseBody.indexOf("}", index) + 1)
        const customHeaders = JSON.parse(substring)
        const customHeadersKey = Object.keys(customHeaders).find((key) => {
            return key.toLowerCase().includes("app-id")
        })
        if (customHeadersKey === undefined){
            return appId
        }

        appId = customHeaders[customHeadersKey]
    } catch (e) {
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting app id: ${e}`)
    }
    finally {
        helperFunctions.getLoggerInstance().info(`App id found: ${appId !== undefined ? appId : "NO"}`)
    }


    return appId
}