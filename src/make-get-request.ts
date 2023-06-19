const helperFunctions = require("./helper-functions")
export default function makeGetRequest(url:string, requestConfig:any){

    const isValidUrl = require("valid-url").isUri(url)
    if (!isValidUrl){
        helperFunctions.getLoggerInstance().error(`${url} is not a valid url`)
        return Promise.resolve(undefined)
    }

    


    return helperFunctions.getAxiosInstance().get(url, requestConfig)
            .then((response: any) => {
                return response
            })
            .catch((error: any) => {
                helperFunctions.getLoggerInstance().error(`Error making get request to ${url}: ${error}`)
                return undefined
    })
}   