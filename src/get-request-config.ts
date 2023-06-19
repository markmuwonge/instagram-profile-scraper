export default function getRequestConfig(configCookies:any, headers:any) {
    return {
        headers: {
            Cookie: function () {
                return configCookies.map((cookie: any) => {
                    return cookie.name + "=" + cookie.value
                }).join("; ")
            }(),
            ...(headers !== undefined && headers),
        }
    }
}