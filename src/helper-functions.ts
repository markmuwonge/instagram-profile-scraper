declare const global: any



export function getLoggerInstance() {
    return global['project'].logger
}

export function getConfig(){
    return global['project']['config']
}

export function getAxiosInstance() {
    return global['project']['axios']['instance']
}