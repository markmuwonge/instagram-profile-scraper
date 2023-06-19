import { config } from "process";

const winston = require('winston');
require('winston-daily-rotate-file');
const helperFunctions = require("./helper-functions")
const fs = require("fs")

const axios = require("axios");
const axiosLogger = require("axios-logger")

const parseJSON = require("./parse-json")

declare const global: any

export default async function set() {
    let set: boolean = false
    
    createObject()
    setLogger()
    createAxiosObject()
    setAxiosInstance()
    try {     
        const configSet: boolean = await setConfig()
        if (!configSet) {
            return
        }
        set = true
    } catch (e) {
        helperFunctions.getLoggerInstance().error(`An error occurred while setting global object: ${e}`)
    }
    finally {
        helperFunctions.getLoggerInstance().info(`Global object set: ${set}`)
    }

    return set
}

function createObject() {
    Object.defineProperty(global, "project", { value: {} })
}

function setLogger() {
    global['project' as string]['logger'] = winston.createLogger({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.DailyRotateFile({
                filename: './logs/combined.log',
                datePattern: 'DD-MM-YYYY',
                zippedArchive: true,
                maxSize: '10m',
                maxFiles: 3
            })
        ]
    })
}

function  createAxiosObject(){
    Object.defineProperty(global.project, "axios", { value: {} })
}

function setAxiosInstance() {
    helperFunctions.getLoggerInstance().info(`Setting Axios instance`)
    global['project' as string]['axios']['instance'] = function (this: any) {
        const axiosInstance = axios.create()
        axiosLogger.setGlobalConfig({
            logger: helperFunctions.getLoggerInstance().info.bind(this)
        })
        axiosInstance.interceptors.request.use(axiosLogger.requestLogger, axiosLogger.errorLogger);
        axiosInstance.interceptors.response.use(axiosLogger.responseLogger, axiosLogger.errorLogger);
        return axiosInstance
    }()
}


function setConfig() {
    return new Promise(async (resolve, reject) => {
        const argv = require('minimist')(process.argv.slice(2));
        if (!Object.keys(argv).includes("c")){
            reject("Argument 'c' not found")
            return
        }

        const configFilePath = argv.c
        const filePathExists = fs.existsSync(configFilePath)
        if (!filePathExists){
            reject(`Invalid config file path '${configFilePath}'`)
            return
        }

        const configFileContents = fs.readFileSync(configFilePath)
        let config:any = parseJSON.default(configFileContents)
        if (!config){
            reject(`Config file not valid JSON`)
        }
        
        if (!Object.keys(config).every((key) => ["cookies_base64", "instagram_handle", "latest_x_posts"].includes(key))){
            reject(`Config file has invalid keys`)
            return
        }

        if (typeof config.cookies_base64  !== "string" || typeof config.instagram_handle  !== "string" || isNaN(config.latest_x_posts)){
            reject(`Config file has invalid values`)
            return
        }

        let cookies = parseJSON.default(Buffer.from(config.cookies_base64, 'base64').toString('ascii') )
        if (!cookies){
            reject(`Cookies couldn't be parsed`)
            return
        }
        delete config.cookies_base64

        config.cookies = cookies
        
        global['project' as string]['config'] = config
        resolve(null)
    })
        .then(() => {
            return true
        })
        .catch((error) => {
            helperFunctions.getLoggerInstance().error(`Error setting config: ${error}`)
            return false
        })
}