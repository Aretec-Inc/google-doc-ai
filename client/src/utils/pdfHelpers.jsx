import React, { useState } from 'react'
import { message, notification } from 'antd'
import { actions, actionTables, actionTypes, arrayOfAllTypes, artifactTypes, getAPIbyType } from './pdfConstants'
import axios from 'axios'
import { Tooltip } from '@material-ui/core'
import moment from 'moment'
import { Popover } from 'antd'
import { ACCOUNTS_APIS, WIDGET_APIS, PROJECTS_APIS, ARTIFACT, SEARCH_APIS, FOLDERS_APIS, PROJECT_FLOW_APIS, DOC_AI_APIS } from './apis'
import { BOOKMARKS_APIS, AUDITS_APIS } from './apis'
import { DASHBOARD_CHARTS } from './apis'
import allPaths from '../Config/paths'
const { GET: { FOLDERS_GET_BY_USER_PROJECT_ID } } = FOLDERS_APIS
const { POST: { ACCOUNT_CHECK_SOCIAL_PARAMS, ACCOUNT_UPDATE_TOKEN }, GET: { ACCOUNT_GET_USER } } = ACCOUNTS_APIS
const { GET: { PROJECTS_BY_USER_ID, PROJECTS_TEMPLATES, PROJECTS_GET_ALL_ADDITIONAL_PROPERTIES } } = PROJECTS_APIS
const { GET: { WIDGETS_GET_WIDGET } } = WIDGET_APIS;
const { GET: { SEARCH } } = SEARCH_APIS;
const { GET: { FOLDERS_GET_ARTIFACTS } } = FOLDERS_APIS
const { GET: { P_FLOW_GET_BUSSINESS_FUNCTION } } = PROJECT_FLOW_APIS;
export const nanosToSecs = (nanos) => (
    (nanos || 0) / 10e8 || 0
)

const { GET: { DASHBOARD_CHARTS_FIND_ALL } } = DASHBOARD_CHARTS;
const { POST: { AUDIT_ADD_AUDIT } } = AUDITS_APIS;
const { POST: { BOOKMARKS_REMOVE_BOOKMARK } } = BOOKMARKS_APIS;
const { GET: { GET_PROCESSORS } } = DOC_AI_APIS;

export const removeSlashFromEnd = (url) => {
    let lastIndex = url?.length - 1
    let endingSlash = url?.lastIndexOf("/") == lastIndex
    if (endingSlash) {
        return removeSlashFromEnd(url?.substring(0, lastIndex))
    }
    else {
        return url
    }
}

export const getDomainOrigin = (url) => {
    try {

        let myURL = new URL(url)
        return myURL?.origin?.replace(/http:/gi, "https:")?.replace(/www./gi, "") + myURL?.pathname
    } catch (e) {
        return url
    }
}

export const generateLinkFromTimeStamp = ({ timestamp, web }) => (
    `https://storage.googleapis.com/web-archives/cloned/${timestamp}/${cleanString(getDomainOrigin(web))}/index.html`
)

export const createKeyWithDate = (date) => {
    let d = new Date(date)
    return `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`
}

export const maxValue = (array, key) => {
    let highestValue = array?.sort((a, b) => b[key] - a[key])?.[0]?.[key]
    return highestValue ? highestValue : array[0][key]
}

export const lowestValue = (array, key) => {
    let leastValue = array?.sort((a, b) => a[key] - b[key])?.[0]?.[key]
    return leastValue ? leastValue : array[0][key]
}

export let compareExistance = (toSearch, SearchFrom) => {
    return Boolean(toSearch && SearchFrom && SearchFrom?.toLowerCase().indexOf(toSearch?.toLowerCase()) > -1)
}

export const dateTimeFormat = (time, format) => moment(time).format(format || `DD MMMM YYYY, h:mm A`)

export const dateFormat = (time, format) => moment(time).format(format || `DD MMMM YYYY`)

export const useForceUpdate = () => {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export const responsiveCardRowsNo = (width) => {
    if (width > 1961) return 18;
    // else if (width > 1698) return 18;
    else if (width > 1430) return 15;
    else if (width > 1163) return 12;
    else if (width > 897) return 9;
    else return 10;
}

export const getProcessorsList = () => (
    new Promise((resolve, reject) => {

        axios.get(GET_PROCESSORS).then((data) => {
            let processorsArray = data?.data;
            if (
                data?.success &&
                Array.isArray(processorsArray) &&
                processorsArray.length
            ) {

                resolve(processorsArray);
                // console.log("ProcessorsList, Server", data?.data)
            }
            else {
                reject(data)
            }
        }).catch(reject)
    })

)

export const convertAnyFileToDataURL = (url) => (
    new Promise(async (resolve, reject) => {
        try {
            let blob = await fetchAsBlob(url)
            let result = await blobToDataURL(blob)

            resolve(result)

        } catch (e) {
            reject(e)
        }
    })
)
const fetchAsBlob = (url) => (
    new Promise((resolve, reject) => (
        fetch(url)
            .then(response => resolve(response.blob()))
            .catch(reject)
    ))

)
const blobToDataURL = (blob) => {
    return new Promise((resolve, reject) => {
        var fileReader = new FileReader();
        fileReader.onload = (e) => { resolve(e.target.result); }
        fileReader.onerror = reject
        fileReader.readAsDataURL(blob);
    })
}
export const convertOBJtoJSONBlob = (json) => {

    return new Promise(async (resolve, reject) => {
        var stringifiedJson = JSON.stringify(json)
        var blob = new Blob([stringifiedJson], { type: 'application/json' })
        resolve(await blobToDataURL(blob))
    })

}
//  <>

export const ConditionalPopover = ({ show, children, ...props }) => {
    if (show) {
        return (


            <Popover {...props} >
                {children}
            </Popover>
        )
    }
    else {
        return children
    }
}
export const ConditionalTooltip = ({ show, children, ...props }) => {
    if (show) {
        return (
            <Tooltip {...props} >
                {children}
            </Tooltip>
        )
    }
    else {
        return children
    }

}
export const isValidURL = (str) => { //Must have protocol http/https
    var pattern = /(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/gi
    return !!pattern.test(str);
}

export const isValidHttpUrl = (str) => {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return Boolean(pattern.test(str));
}

export const isOBJECT = (obj) => Boolean(obj && !Array.isArray(obj) && typeof obj == "object")

export const cleanString = (str) => str?.replace(/[^a-zA-Z]/g, "")

export const cleanFieldName = (name, dontTrim) => {
    /**
     *  A column name must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_), and it must start with a letter or underscore. The maximum column name length is 300 characters. A column name cannot use any of the following prefixes:

     */
    let removeExtraSpacesOrUnderScore = (txt) => txt?.replace(/ |\/|\\/gi, '_')?.replace(/__/gi, '_')

    let cleanedWord = removeExtraSpacesOrUnderScore((dontTrim ? name : name?.trim())?.replace(/[^a-z0-9_/\\ ]/gi, ""))
    if (cleanedWord?.startsWith("_")) {
        cleanedWord = cleanedWord?.slice(1, cleanedWord?.length)
        cleanedWord = removeExtraSpacesOrUnderScore(cleanedWord)
    }

    if (!isNaN(cleanedWord?.[0])) {
        cleanedWord = "a_" + cleanedWord?.slice(0, cleanedWord?.length)
        cleanedWord = removeExtraSpacesOrUnderScore(cleanedWord)


    }
    return cleanedWord
}

export const perc2color = (perc) => {
    debugger
    let r, g, b = 0
    if (perc < 50) {
        r = 255
        g = Math.round(5.1 * perc)
    }
    else {
        g = 255
        r = Math.round(510 - 5.10 * perc)
    }
    let h = r * 0x10000 + g * 0x100 + b * 0x1
    return '#' + ('000000' + h.toString(16)).slice(-6)
}

const randomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const isNull = (value) => { //work for strings/numbers/arrays/objects
    // console.log(value)
    if (typeof value == "number" || typeof value == "boolean") { //if any number let it be 0 or any boolean, it will return false
        return false
    }
    else if (Array.isArray(value)) { //if its empty array it will return true
        return Boolean(value?.length)
    }
    else if (value && typeof value == "object") { //if empty object, returns true
        return Boolean(Object.keys(value)?.length)
    }
    else { //now lets check for string
        return !value || value == undefined || value == null || value?.trim()?.toLowerCase() == "null" || value?.trim()?.toLowerCase() == "undefined" || value?.trim()?.toLowerCase() == "false"

    }
}

const successMessage = (desc = 'Successfully Complete!') => {
    return message.success(desc)
}

export const requiredMessage = (value) => `Please input your ${value}!`

export const inputPlace = (value) => `${value} Here...!`

export const infoMessage = (desc = 'Successfully Complete!') => {
    return message.info(desc)
}

const errorMessage = (desc = 'Oops Something Went Wrong!') => {
    return message.error(desc)
}

const warningMessage = (desc = 'Warning!') => {
    return message.warning(desc)
}

const successNotification = (message = 'Successfully Complete!') => {
    return notification.success({ message })
}

const errorNotification = (message = 'Oops Something Went Wrong!') => {
    return notification.error({ message })
}

const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

const beforeUpload = (file) => {
    const fileType = file?.type === 'image/jpeg' || file?.type === 'image/png'
    if (!fileType) {
        return message.error('You can only upload JPG/PNG file!')
    }
    return false
}

const convertTitle = (val) => val.charAt(0).toUpperCase() + val.slice(1)

const convertTitleReplace = (val) => val?.split('_')?.map(v => `${convertTitle(v)}`)?.join(' ')

const stringLimiter = (val) => `${val.slice(0, Math.floor(window.innerWidth / 100)).map(e => e.Name).join(', ').slice(0, Math.floor(window.innerWidth / 10))}...`

const nameSplit = (val) => val.split(' ').slice(-1)[0]

const tableColumnName = (v) => convertTitle(v.split('_')?.join(' '))

const updateUrl = (url) => url?.replace('gs://', 'https://storage.googleapis.com/')


const eventTrigger = async (action, action_type, action_table = 'test', user_id, project_id) => {
    let projectid = localStorage.getItem('currentProjectId') || project_id || null
    let obj = { action, action_type, action_table, user_id, project_id: projectid }
    const data = await axios.post(AUDIT_ADD_AUDIT, obj)
}

export const parseURL = (url) => url.replace(/\/\//g, "/")

const returnDefaultData = (data) => {
    const withDefaultData = data.data?.filter((data) => {
        let hasRequiredData = data?.item?.artifact_type && data?.item?.file_name && data?.item?.artifact_size && data?.item?.file_address && data?.item?.id
        return hasRequiredData
    })
    return withDefaultData || []
}

export const getListOfDuplicateArrayOfObjects = (array, propertyName) => {
    let cleanProperty = (property) => typeof property == "string" ? property?.trim().toLowerCase() : property
    let arrayWithProperValues = array.filter(d => !isNull(d?.[propertyName]))
    var lookup = arrayWithProperValues.reduce((a, e) => {
        a[cleanProperty(e?.[propertyName])] = ++a[cleanProperty(e?.[propertyName])] || 0;
        return a;
    }, {});

    return arrayWithProperValues.filter(d => lookup[cleanProperty(d?.[propertyName])]).filter(Boolean)
}

export const getUniqueArrayOfObjects = (ary, objectPropertName) => {
    let cleanProperty = (property) => typeof property == "string" ? property?.trim().toLowerCase() : property
    return Array.isArray(ary) ?
        ary?.filter((elem, index) => {
            let filteredByProperty = ary?.findIndex(obj => {
                let obj1V = obj?.[objectPropertName]
                let obj2V = elem?.[objectPropertName]
                let value1 = cleanProperty(obj1V)
                let value2 = cleanProperty(obj2V)
                return value1 == value2
            })
            return filteredByProperty == index
        }) : []
}

export const get_folders_data = (project_id, userId = '', limit = 10, page = 0) => {
    return axios.get(`${FOLDERS_GET_BY_USER_PROJECT_ID}?user_id=${userId}&project_id=${project_id}&limit=${limit}&page=${page}`)
}

export const get_user_projects = (userId) => {
    return axios.get(`${PROJECTS_BY_USER_ID}?user_id=${userId}`)
}

export const get_project_templates = (userId) => {
    return axios.get(`${PROJECTS_TEMPLATES}?userId=${userId}`)
}

const fetch_all_artifacts_by_type = (TYPE, page = 0, userId = null, search = '', limit = 20) => {
    let type = artifactTypes?.[TYPE]?.type
    var obj = {
        type,
        limit,
        page,
        search,
        ...userId ? { user_id: userId } : {}
    }
    return axios.post(ARTIFACT.POST.GET_ALL_ARTIFACTS_BY_TYPE, obj)
}


export const get_folder_artifacts = (folderId, project_id, limit = 10, page = 0, user_id) => {// IN NEW APIS INTEGRATION NOT UPDATING ELSE OF IF ARTIFACT AND IF DATA SUCCESS BECAUSE THE PREVIOUSLY WRITTEN ERROR MESSAGE OBJECT MIGHT BE USED SOMEWHERE
    return new Promise(async (resolve, reject) => {
        let userParam = ''
        if (user_id) { userParam = `&user_id=${user_id}` }
        let data = await axios.get(`${FOLDERS_GET_ARTIFACTS}?folder_id=${folderId}&project_id=${project_id}&limit=${limit}&page=${page}${userParam}`)
        let responseData = data?.data
        let count = data?.count
        if (data?.success && count) {
            let artifactList = responseData?.map(({ artifact }) => artifact && { ...artifact })
            if (artifactList) {
                let artifactOBJ = {

                    [folderId]: {
                        artifactList,
                        count,
                        folderId,
                        page
                    }
                }
                resolve(artifactOBJ)
            }
            else {
                let errMSG = { code: "NO_ARTIFACTS", message: 'No files has been added to this folder', developerInfo: { folderId, limit, page, data } }
                reject(errMSG)
            }
        }
        else {
            let errMSG = { code: "UN_SUCCESS", message: count ? 'Request not successful' : 'No files has been added to this folder', developerInfo: { folderId, limit, page, data } }
            reject(errMSG)
        }
    })
}

export const get_artifacts_of_all_folders = (folderList, project_id, limit = 10, page = 0) => {
    return new Promise(async (resolve, reject) => {

        let allArtifacts = {}
        for (let i = 0; i < folderList.length; i++) {
            let folder = folderList[i]
            let folderId = folder?.id
            if (folderId) {
                try {
                    let artifactDATA = await get_folder_artifacts(folderId, project_id, limit, page)
                    if (artifactDATA && typeof artifactDATA == "object") {
                        Object.assign(allArtifacts, artifactDATA)
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
        resolve(allArtifacts)
    })
}

export const get_OBJ_of_artifacts_by_Type = (TYPE, page = 0, userId = null, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { data } = await fetch_all_artifacts_by_type(TYPE, page, userId, limit)
            let artifactList = data?.data?.rows
            let count = data?.data?.count

            resolve({ [TYPE]: { count, artifactList, folderId: TYPE, page } })
        } catch (err) {
            reject(err)
        }
    })
}

export const get_OBJ_of_artifacts = async (page = 0, userId = null, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        let artifacts = {}
        for (let i = 0; i < arrayOfAllTypes.length; i++) {
            let TYPE = arrayOfAllTypes[i]
            try {
                let { newDataa } = await get_OBJ_of_artifacts_by_Type
                Object.assign(artifacts, newDataa)
            }
            catch (e) {
                console.log(e)
            }
        }
        resolve(artifacts)

    })
}

export const parseIntoObject = (ObjectString) => {
    try {
        return JSON.parse(ObjectString)
    } catch (e) {
        console.log(e)
        return null //Return null incase fails to convert into an object
    }
}

let convertStringPropertyToObject = (rows, property, parentKey = null) => {
    if (rows && property) {
        let newRows = rows.map(r => {

            let parsedProperty = parseIntoObject(parentKey ? r[`${parentKey}`][`${property}`] : r[`${property}`])

            let parsedData = parentKey ? ({
                [`${parentKey}`]: { [`${property}`]: parsedProperty, ...r[`${parentKey}`] }
            }) : (
                { [`${property}`]: parsedProperty }
            )
            return { ...r, ...parsedData }

        })
        return newRows.filter(d => d && (d[`${property}`] || d?.[`${parentKey}`]?.[`${property}`]))//Make sure that property is not null/undefined.
    }
    else {
        console.log("ROWS NOT FOUND =>>> ", rows)
        return rows
    }
}

const convertVisStateToObject = (rows) => {
    return convertStringPropertyToObject(rows, "vizState")
}

const convertLayoutToObject = (rows) => {
    return convertStringPropertyToObject(rows, "layout")
}

const convertPropertiesToObject = (rows) => {
    return convertStringPropertyToObject(rows, "properties")
}

export const fetch_user_widget_by_workspace_id = (workspace_id, page = 0, limit = 10) => {
    return new Promise((resolve, reject) => {
        if (workspace_id) {
            axios.get(`${WIDGETS_GET_WIDGET}?limit=${limit}&page=${page}&workspace_id=${workspace_id}`)
                .then((data) => {
                    if (data.success) {
                        let rows = data?.data?.rows
                        if (rows.length) {
                            let isVisStateString = typeof rows?.[0]?.properties == "string"
                            let isLayoutString = typeof rows?.[0]?.layout == "string"
                            if (isVisStateString) {
                                rows = convertPropertiesToObject(rows)
                            }
                            if (isLayoutString) {
                                rows = convertLayoutToObject(rows)
                            }
                            resolve({ rows, count: data?.data?.count })
                        }
                        else {
                            let err = { code: 'NO_DATA', message: 'Unknown error occurred', developer_message: "No data received from server #ref=> fetch_user_widget_by_workspace_id", more_info: { response: data } }
                            console.log(err)
                            reject(err)
                        }
                    }
                    else {
                        let err = { code: 'SUCCESS_FALSE', message: 'Unknown error occurred', developer_message: "Success is false from fetch_user_widget_by_workspace_id", more_info: { response: data } }
                        console.log(err)
                        reject(err)
                    }
                })
        }
        else {
            let err = { code: 'PARAMS_MISSING', message: 'Unknown error occurred', developer_message: "workspace_id is missing couldn't call API." }
            reject(err)
            console.err(err)
        }
    })
}

export const fetch_dashboard_charts = (userId, limit = 20, page = 0) => {
    return new Promise((resolve, reject) => {
        axios.get(`${DASHBOARD_CHARTS_FIND_ALL}?limit=${limit}&page=${page}&userId=${userId}`)
            .then((data) => {
                if (data?.success) {
                    if (data?.data?.rows.length) {
                        let rows = data.data?.rows
                        let isVisStateString = typeof data.data?.rows[0].vizState == "string"
                        let isLayoutString = typeof data.data?.rows[0].layout == "string"
                        if (isVisStateString) {
                            rows = convertVisStateToObject(rows)
                        }
                        if (isLayoutString) {
                            rows = convertLayoutToObject(rows)
                        }

                        resolve(rows)
                    }
                    else {
                        console.log("Did not receive data=> ", data)
                        reject({ code: "NO_DATA", message: "An unknown error occurred", developer_message: "Did not receive data from API", more_info: { response: data } })
                    }
                }
                else {
                    let errMsg = data?.message;
                    reject({ code: "NO_DATA", message: errMsg || "An unknown error occurred", developer_message: "Did not receive data from API", more_info: { response: data } })
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

export const load_artifact_data_by_type = (artifactData) => {
    return new Promise((resolve, reject) => {

        let artifact_type = artifactData?.artifact_type
        let file_name = artifactData?.file_name
        let artifactAPI = getAPIbyType(artifact_type)

        if (artifact_type) {
            if (artifactAPI) {
                axios.get(`${artifactAPI}/${file_name}`)
                    .then((data) => {
                        if (data?.success) {
                            if (Object.keys(data?.data).length !== 0 && (data?.data).constructor === Object) {
                                if (!artifactData.id) {
                                    errorMessage(`An internal error occured, CODE: IDNOTFND`)
                                }
                                let fullData = { ...artifactData, ...data.data, artifact_id: artifactData.id }
                                resolve(fullData)
                            }
                            else {
                                let msg = data?.message ? data.message : 'No Records Found'
                                let err = { code: "Missing_DATA", message: msg, more_info: { response: data, api: artifactAPI } }
                                reject(err)
                            }
                        }
                        else {
                            let msg = data?.message || 'No Records Found'
                            let err = { code: "Missing_DATA", message: msg, more_info: { response: data, api: artifactAPI } }
                            reject(err)
                        }

                    })
                    .catch(reject)
            }
            else {
                let error = { code: "API_MISSING", message: "Something went wrong", more_info: { api: artifactAPI } }
                reject(error)
            }
        }
        else {
            reject({ code: 'NO_PARAMS' })
        }
    })
}

const userObject = (result) => {
    const { profileObj } = result
    return {
        email: profileObj.email,
        social_id: profileObj.googleId,
        first_name: profileObj.givenName,
        last_name: profileObj.familyName
    }
}

const googleLogin = async (result, history, loginUser, dispatch) => {
    const obj = userObject(result)
    return axios.post(ACCOUNT_CHECK_SOCIAL_PARAMS, obj)
        .then((res) => {
            const { data } = res
            localStorage.setItem('accesstoken', data?.data?.access_token)
            if (data?.success) {
                dispatch(loginUser(data?.data))
                successMessage(data?.message || 'Successfully Logged In!')
                eventTrigger(actions.click, actionTypes.login, actionTables.user, data?.data?.id)
                return setTimeout(() => {
                    history.push('/')
                }, 300)
            }
            else if (data?.pending) {
                warningMessage(data?.message)
            }
            else {
                errorMessage(data?.message)
            }
            return false
        }).catch((err) => {
            let erMsg = err?.response?.data?.message;
            erMsg && errorMessage(erMsg);
            console.log("google login error", err)
        })
}

const removeBookmark = (id) => {
    return new Promise((resolve, reject) => {
        if (id) {
            axios.post(BOOKMARKS_REMOVE_BOOKMARK, { id })
                .then((data) => {
                    // console.log('DATA DELETE API', data)
                    if (data?.success) {
                        successNotification(data?.message || 'Removed from Bookmarks!')
                        resolve(data)
                    }
                    else {
                        let errMsg = data?.message;
                        errMsg && errorNotification(errMsg);
                        resolve(data)
                    }
                })
                .catch(reject)
        }
        else {
            console.log("id not found => ", id)
            const errr = { succes: false, code: "NO_ID", message: 'An unknown error occurred ref:NO_ID' }
            resolve(errr)
            errorNotification(errr.message ? errr.message : "Something Went Wrong When Removing Bookmark")
        }
    })
}

const validateLength = (val, len = 15) => val.length > len ? `${val.slice(0, len)}...` : val

// const setActiveMenu = (path) => path === '/home' || path === '/recent-upload' || path === '/advance' ? 0 : path === '/template-dashboard' ? 1 : path === '/search' || path === '/filemanager' ? 2 : path === '/flowdesigner' ? 3 : path === '/workspace' ? 4 : path === '/datagraph' ? 5 : path === '/admin' || path === '/users' ? 6 : path === '/project-activities' ? 7 : path === '/project_workflow' ? 8 : path === '/flow-datablocks' ? 9 : path === '/web-archives' ? 10 : 11

const setActiveMenu = (path) => path === allPaths?.home || path === allPaths?.recentUpload || path === allPaths?.ADVANCE ? allPaths?.home : path === allPaths?.project_dashboard ? allPaths?.project_dashboard : path === allPaths?.search ? allPaths?.search : path === allPaths?.filemanager ? allPaths?.filemanager : path === allPaths?.flowdesignermain ? allPaths?.flowdesignermain : path === allPaths?.workspace ? allPaths?.workspace : path === allPaths?.neo4jmainscreen ? allPaths?.neo4jmainscreen : path === allPaths?.admin ? allPaths?.admin : path === allPaths?.users ? allPaths?.users : path === allPaths?.project_activities ? allPaths?.project_activities : path === allPaths?.project_workflow ? allPaths?.project_workflow : path === allPaths?.flow_data_blocks_flows ? allPaths?.flow_data_blocks_flows : path === allPaths?.webArchive ? allPaths?.webArchive : path === allPaths?.custom_models ? allPaths?.custom_models : path === allPaths?.project_settings ? allPaths?.project_settings : 11



const createColumns = (cols) => {
    const columns = []
    var obj = {
        dtype: 'int64',
        locked: true,
        name: 'dtale_index',
        visible: true,
        width: 70
    }
    columns.push(obj)
    for (var i in cols) {
        obj = {
            dtype: 'string',
            hasMissing: 0,
            hasOutliers: 0,
            index: i,
            locked: true,
            name: cols[i],
            unique_ct: 0,
            visible: true,
            width: 200
        }
        columns.push(obj)
    }
    return columns
}

const createRows = (rowData) => {
    const rows = {}

    for (var i in rowData) {
        rows[i] = {}
        rows[i]['dtale_index'] = {
            raw: i,
            style: {},
            view: String(i)
        }
        for (var j in rowData[i]) {
            rows[i][j] = {
                raw: rowData[i][j],
                style: {},
                view: rowData[i][j]
            }
        }
    }
    return rows
}

const checkOnlineStatus = async (url) => {
    try {
        return await axios.get('/api/sss')
            .then((res) => {
                const { headers } = res
                if (headers['content-type'].indexOf('html') === -1) {
                    return { isOnline: true, status: 200 }
                }
                return { isOnline: false, status: 404 }
            })
            .catch(() => {
                return { isOnline: false, status: 500 }
            })
    }
    catch (err) {
        return { isOnline: false, status: 403 }
    }
}

const resultMessages = (status) => {
    return status === 404 ? 'Oops, No Data found!' : status === 403 ? 'Oops, you are offline!' : 'Oops, Something went wrong!'
}

const textHighlight = (text, indices) => {
    let arr = []
    indices.forEach(index => {
        let word = text.slice(index[0], index[1] + 1)
        arr.push(word)
    })
    return arr
}

const removeSpace = (e) => e.replace(/ |-/g, '_')

const getUserById = (id) => {
    return axios.get(`${ACCOUNT_GET_USER}/${id}`)
    // return axios.get(`/api/user/get_user/${id}`)
}

const search_artifacts = (searchValue, type, page = 0, projectId, description_type = null) => {
    return axios.get(`${SEARCH}?search=${searchValue}&type=${type}&page=${page}&project_id=${projectId}`)
}


const nodeDeleteFuncHelper = (idd, state, setElements) => { // THIS FUNCTION IS USED FOR DELETING NODES IN PROJECT FLOW
    let allNodes = state?.nodes;
    let allEdges = state?.edges;

    let allNodesswithoutthisid = Array.isArray(allNodes) && allNodes.length > 0 && allNodes.filter((ee) => ee.id != idd)
    let allEdgesswithoutthisid = Array.isArray(allEdges) && allEdges.length > 0 && allEdges.filter(
        (ee) => ee.source != idd && ee.target != idd
    );

    let newElements = (allNodesswithoutthisid && allEdgesswithoutthisid) ? [...allNodesswithoutthisid, ...allEdgesswithoutthisid] : [];
    setElements(newElements)
}

const nodeDeleteFuncHelperFlowDB = (idd, state, setElements, setTableData, setVisualData, setShowVisual, setShowTable) => { // THIS FUNCTION IS USED FOR DELETING NODES IN FLOW DATA BLOCKS
    let allNodes = state?.nodes;
    let allEdges = state?.edges;

    let allNodesswithoutthisid = Array.isArray(allNodes) && allNodes.length > 0 && allNodes.filter((ee) => ee.id != idd);
    let allEdgesswithoutthisid = Array.isArray(allEdges) && allEdges.length > 0 && allEdges.filter(
        (ee) => ee.source != idd && ee.target != idd
    );

    let currentNodeTargetIds = [];
    Array.isArray(allEdges) && allEdges.length > 0 && allEdges.forEach(d => {
        if (d?.source == idd) {
            currentNodeTargetIds.push(d?.target)
        }
    });

    let changedNodes = [];
    if (Array.isArray(currentNodeTargetIds) && currentNodeTargetIds.length) {

        currentNodeTargetIds.forEach(id => {
            let obj = allNodesswithoutthisid.find(d => d?.id === id);
            let nodeDataObj = {};
            if (obj?.data?.nodeData && Object.keys(obj?.data?.nodeData).length) {
                let keys = Object.keys(obj?.data?.nodeData);
                keys.forEach(ee => {
                    if (ee != idd && ee != "data") {
                        console.log("inside if", ee)
                        Object.assign(nodeDataObj, { [ee]: obj?.data?.nodeData?.[ee] })
                    }
                })
            };
            let data = {
                ...obj?.data,
            };
            Object.assign(data, { nodeData: { ...nodeDataObj } });
            Object.assign(obj, { data });
            changedNodes.push(obj);
        });

        let allUnchangedNodes = allNodesswithoutthisid.filter(d => !currentNodeTargetIds.includes(d?.id));

        // console.log("all nodes==>", [...changedNodes, ...allUnchangedNodes]);

        let a = [...changedNodes, ...allUnchangedNodes, ...allEdgesswithoutthisid];
        setElements(a);
    }
    else {
        let newElements = (allNodesswithoutthisid && allEdgesswithoutthisid) ? [...allNodesswithoutthisid, ...allEdgesswithoutthisid] : Array.isArray(allNodesswithoutthisid) && allNodesswithoutthisid.length ? [...allNodesswithoutthisid] : [];
        setElements(newElements);
    }

    setTableData([]);
    setVisualData([]);
    setShowVisual(false);
    setShowTable(false);
}

const passDataToTargetNodes = (edges, newElements, dataToPass, setElements, id) => {

    let targetNodeIds = edges?.filter(d => d?.source === id)?.map(d => d?.target);

    let targetNodesArr = [];

    if (Array.isArray(targetNodeIds) && targetNodeIds.length) {

        targetNodeIds.forEach(e => {
            let obj = newElements.find(d => d?.id == e)
            targetNodesArr.push(obj)
        })

        let newTargetNodesArr = [];
        if (Array.isArray(targetNodesArr) && targetNodesArr.length) {
            targetNodesArr.forEach(currentNodeObj => {

                let obj = currentNodeObj?.data?.nodeData?.data ? { data: currentNodeObj?.data?.nodeData?.data } : {};


                let nDataObj = {
                    ...currentNodeObj?.data,
                    nodeData: {
                        [id]: dataToPass,
                        ...obj
                    }
                };
                let newObj = {
                    ...currentNodeObj, data: nDataObj
                }

                newTargetNodesArr.push(newObj)

            })
        }

        let newels = [];
        newElements && newElements.forEach(obj => {

            if (obj?.id) {

                targetNodeIds.forEach(e => {
                    if (obj?.id !== e) {
                        newels.push(obj)
                    }
                })

            }
            else {
                newels.push(obj)
            }

        })

        let newE = [...newels, ...newTargetNodesArr]

        setElements(newE)

    }
    else {
        setElements(newElements)
    }

}

// PROVIDE LENGTH IN PARAMETER AND IT WILL RETURN RANDON STRING CONSISTING OF SMALL AND CAPITALS LETTERS
function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

let copyText = (text) => {
    if (typeof navigator?.clipboard?.writeText == "function" && text) {
        navigator.clipboard.writeText(text)
        message.info("Copied to clipboard!")
    }
}

let getAllData = async (userId, reduxActions) => {
    // let allPromises = []

    get_user_projects(userId)
        .then((data) => {
            if (data?.success) {
                let myProjects = data.myProjects

                let sharedProjects = data.sharedProjects
                if (myProjects && Array.isArray(myProjects)) {
                    reduxActions.setProjectsList(myProjects)
                }
                if (sharedProjects && Array.isArray(sharedProjects)) {
                    reduxActions.setShareProjectsList(sharedProjects)
                }
            }
            else {
                let errMsg = data?.message;
                console.log("errMsg get_user_projects=>", errMsg);
            }
        })
        .catch((err) => {
            let errMsg = err?.response?.data?.message;
            console.log("errMsg", errMsg);
        })

    get_project_templates(userId)
        .then((data) => {
            if (data?.success) {
                let temp = data.data
                if (temp && Array.isArray(temp)) {
                    reduxActions.setTemplatesData(data.data)
                }
            }
            else {
                let errMsg = data?.message;
                console.log("errMsg get_project_templates=>", errMsg)
            }
        })
        .catch((err) => {
            let errMsg = err?.response?.data?.message;
            console.log("errMsg get_project_templates=>", errMsg)
        })

    axios.get(P_FLOW_GET_BUSSINESS_FUNCTION)
        .then((data) => {
            if (data?.success) {
                reduxActions.setBusinessFunctions(data.data)
            }
            else {
                let errMsg = data?.message;
                errMsg && console.log(errMsg);
            }
        })
        .catch((err) => {
            let errMsg = err?.response?.data?.message;
            errMsg && console.log(errMsg);
        })

    axios.get(PROJECTS_GET_ALL_ADDITIONAL_PROPERTIES)
        .then((data) => {
            if (data?.success) {
                reduxActions.setAdditionalProperties(data.data)
            }
            else {
                let errMsg = data?.message;
                console.log("errMsg get_project_templates=>", errMsg)
            }
        })
        .catch((err) => {
            let errMsg = err?.response?.data?.message;
            console.log("errMsg get_project_templates=>", errMsg)
        })

}

export const relativeURLToAbsoluteURL = (url, base) => {
    if ('string' !== typeof url || !url) {
        return null; // wrong or empty url
    }
    else if (url.includes(".pdf")) {
        return null
    }
    else if (url.startsWith("file://")) {
        let urlwithoutfile = url?.replace(/file:\/\//, "")
        let urlPath = urlwithoutfile?.startsWith("/") ? urlwithoutfile : "/" + urlwithoutfile
        return base + urlPath
    }
    else if (url.match(/^[a-z]+\:\/\//i)) {
        return url; // url is absolute already 
    }
    else if (url.match(/^\/\//)) {
        return 'https:' + url; // url is absolute already 
    }
    else if (url.match(/^[a-z]+\:/i)) {
        return url; // data URI, mailto:, tel:, etc.
    }
    else if ('string' !== typeof base) {
        var a = document.createElement('a');
        a.href = url; // try to resolve url without base  
        if (!a.pathname) {
            return null; // url not valid 
        }
        return 'https://' + url;
    }
    else {
        base = relativeURLToAbsoluteURL(base); // check base
        if (base === null) {
            return null; // wrong base
        }
    }
    var a = document.createElement('a');
    a.href = base;

    if (url[0] === '/') {
        base = []; // rooted path
    }
    else {
        base = a.pathname.split('/'); // relative path
        base.pop();
    }
    url = url.split('/');
    for (var i = 0; i < url.length; ++i) {
        if (url[i] === '.') { // current directory
            continue;
        }
        if (url[i] === '..') { // parent directory
            if ('undefined' === typeof base.pop() || base.length === 0) {
                return null; // wrong url accessing non-existing parent directories
            }
        }
        else { // child directory
            base.push(url[i]);
        }
    }
    return a.protocol + '//' + a.hostname + base.join('/');
}

export {
    removeBookmark,
    fetch_all_artifacts_by_type,
    randomInteger,
    successMessage,
    errorMessage,
    warningMessage,
    successNotification,
    errorNotification,
    getBase64,
    beforeUpload,
    convertTitle,
    stringLimiter,
    nameSplit,
    updateUrl,
    eventTrigger,
    googleLogin,
    returnDefaultData,
    validateLength,
    setActiveMenu,
    createColumns,
    createRows,
    checkOnlineStatus,
    resultMessages,
    textHighlight,
    removeSpace,
    getUserById,
    tableColumnName,
    search_artifacts,
    nodeDeleteFuncHelper,
    nodeDeleteFuncHelperFlowDB,
    passDataToTargetNodes,
    getRandomString,
    copyText,
    getAllData,
    convertTitleReplace
}