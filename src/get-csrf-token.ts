const helperFunctions = require("./helper-functions")
export default function getCsrfToken(responseBody: String) {
    helperFunctions.getLoggerInstance().info("Getting CSRF token from response body")

    let csrfToken = undefined
    try {
        const needle = "csrf_token";
        const startingIndices = [];

        let indexOccurence = responseBody.indexOf(needle, 0);
        while (indexOccurence >= 0) {
            startingIndices.push(indexOccurence);
            indexOccurence = responseBody.indexOf(needle, indexOccurence + 1);
        }

        const startingIndex = startingIndices.find((startingIndex) => {
            return responseBody[startingIndex + needle.length] !== "\\"
        })

        if (startingIndex === undefined) {
            return csrfToken
        }

        const colonIndex = responseBody.indexOf(":", startingIndex);
        const commaIndex = responseBody.indexOf(",", startingIndex);
        let substring = responseBody.substring(
            colonIndex,
            commaIndex
        );
        substring = substring.substring(
            substring.indexOf("\"") + 1,
            substring.lastIndexOf("\""),
        );

       csrfToken = substring
    } catch (e) {
        helperFunctions.getLoggerInstance().error(`An exception occurred while getting CSRF token: ${e}`)
    }
    finally {
        helperFunctions.getLoggerInstance().info(`CSRF token found: ${csrfToken !== undefined ? csrfToken : "NO"}`)
    }


    return csrfToken
}