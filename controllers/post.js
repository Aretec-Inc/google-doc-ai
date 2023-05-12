
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
const moment = require('moment')
const axios = require('axios')
const { runQuery, apiResponse, successFalse, validateData, formLoop } = require('../helpers')
const registerSecret = 'verify'
const { postgresDB, storage, schema } = require('../config')
const { generateBodyResponse } = require('../services/tokenService')

const docAIBucket = storage.bucket(`context_primary`)

let minutes = process.env.NODE_ENV === 'production' ? 15 : 60

// const secretKey = 'access_token'
const secretKey = process.env?.secretKey

const login = (req, res) => {
    try {
        const { email, password } = req.body

        let sqlQuery = `SELECT user_id, password, name, email, auth_type, role, is_deleted, created_at, updated_at, last_login, curr_login FROM ${schema}.users WHERE email='${email}' AND auth_type='web' and is_deleted is not true`

        // Run the query
        runQuery(postgresDB, sqlQuery)
            .then(async (row) => {
                console.log('SQL QUERY ROW', row)
                if (!row?.length) {
                    return successFalse(res, 'Try To Sigin Google With This Email or Your Account is Not Ready Yet !', 500)
                }
                // else if (row[0]?.resp) {
                //     return successFalse(res, 'This Email Is Not Valid or Your Account is Not Verified Yet !', 404)
                // }
                // If there is a user with the given email, but the password the user gives us is incorrect
                else if (!await bcrypt.compare(password, row[0]?.password)) {
                    return successFalse(res, 'Password is Incorrect!', 500)
                }
                else {
                    let sqlQuery = `SELECT user_id, name, email, auth_type, role, created_at, updated_at, TO_CHAR(last_login,'Mon dd, yyyy hh12:mi AM') as last_login_date FROM virgin_island.users WHERE email='${email}'`

                    const userRow = await runQuery(postgresDB, sqlQuery)
                    console.log('userRow ==>', userRow)
                    let dbUser = userRow?.[0]
                    let token = await jwt.encode({
                        userId: dbUser?.user_id,
                        exp: moment().add(minutes, 'minutes').valueOf()
                    }, secretKey)
                    console.log("TOKEN ===>", token)
                    res.setHeader('accesstoken', token)
                    dbUser.access_token = token
                    let obj = {
                        success: true,
                        userData: dbUser,
                        message: 'Successfully Logged In!'
                    }
                    return apiResponse(res, 201, obj)
                }
            })
            .catch((e) => {
                console.log('e', e)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message)
    }
}

const register = (req, res) => {
    try {
        const { name, email, password } = req?.body

        const id = uuidv4()
        if (!email) {
            return successFalse(res, 'Email Cannot Be Empty!', 402)
        }

        let sqlQuery = `SELECT * FROM virgin_island.users WHERE email='${email}'`
        let token, hashPassword

        // Run the query
        runQuery(postgresDB, sqlQuery)
            .then(async (row) => {
                if (row?.length > 0) {
                    return successFalse(res, 'User Already Exist With This Email, Please Login through Email and Password!', 406)
                }
                else {
                    hashPassword = await bcrypt.hash(password, 10)
                    token = jwt.encode({
                        user_id: id,
                        email: email,
                        exp: moment().add(1, 'day').valueOf()
                    }, registerSecret)

                    sqlQuery = `INSERT INTO virgin_island.users(user_id, name, email, password, auth_type, created_at, updated_at, role) VALUES ('${id}', '${name}', '${email}', '${hashPassword}', 'web',  NOW(), NOW(), 'applicant')`
                    req.body.token = token
                    console.log(token)
                    runQuery(postgresDB, sqlQuery)
                        .then(async () => {
                            let obj = {
                                success: true,
                                message: 'Registration Completed Successfully!'
                            }
                            // emailText(req.body)
                            return apiResponse(res, 200, obj)

                        })
                        .catch((e) => {
                            console.log('e', e)
                            return successFalse(res, e?.message)
                        })
                }
            })
            .catch((e) => {
                console.log('e', e)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message)
    }
}

const createSubmmission = async (req, res) => {
    try {
        const { processorId, processorName, submissionName } = req.body
        const id = uuidv4()

        if (!processorId || !processorName || !submissionName) {
            return successFalse(res, 'Please Provide All Fields!', 500)
        }

        const user_id = '471729f9-d14d-4632-868f-16b7d19656ec'

        let sqlQuery = `INSERT INTO ${schema}.submissions(id, processor_id, submission_name, processor_name, user_id, status, created_at)
            VALUES ('${id}', ${validateData(processorId)}, ${validateData(submissionName)}, ${validateData(processorName)}, ${validateData(user_id)}, 'Processing', NOW());`

        // Run the query
        runQuery(postgresDB, sqlQuery)
            .then(async (row) => {
                let obj = {
                    success: true,
                    message: 'Submission Created Successfully!',
                    id,
                    processor_id: processorId
                }
                return apiResponse(res, 201, obj)
            })
            .catch((e) => {
                console.log('e', e)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message)
    }
}

const generateUploadSignedUrl = async (req, res) => {
    try {
        let { fileOriginalName, contentType } = req.query
        // let Origin = process.env.NODE_ENV === 'production' ? `https://${process.env.ALLOWED_ORIGIN}` : 'http://localhost:3000'
        const Origin = process.env.NODE_ENV === 'prdouction' ? 'https://doc-ai-znp7f527ca-uc.a.run.app' : 'http://localhost:3000'
        const folder = 'doc_ai'
        let id = uuidv4()

        if (!fileOriginalName || !contentType) {
            return successFalse(res, 'All Fields are Required!')
        }

        console.log('Origin', Origin)

        fileOriginalName = `${id}-${fileOriginalName}`?.replace(/'|"/g, '')

        // These options will allow temporary uploading of the file with outgoing
        const options = {
            version: 'v4',
            action: 'resumable',
            expires: Date.now() + 600 * 60 * 1000, // 10 hours
            contentType: contentType
        }

        const [url] = await docAIBucket.file(`${folder}/${fileOriginalName}`).getSignedUrl(options)
        let fileUrl = `gs://${docAIBucket.name}/${folder}/${fileOriginalName}`

        let signedURI = await axios.post(`${url}`, {}, {
            headers: { 'Content-Type': contentType, 'x-goog-resumable': 'start', 'Origin': Origin }
        })

        return generateBodyResponse({ success: true, sessionUrl: signedURI.headers.location, fileUrl: fileUrl, fileType: contentType, fileId: id }, res)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message)
    }
}

const uploadDocuments = async (req, res) => {
    try {
        const pendingPromises = []
        let errArr = []
        let allForms = []
        let { submission_id, processorId, files } = req.body

        const user_id = '471729f9-d14d-4632-868f-16b7d19656ec'
        const user_email = 'waqas@aretecinc.com'

        let sqlQuery = ``

        for (const file of files) {
            let fileId = file.fileId
            let fileUrl = file.fileUrl
            let file_type = file.fileType

            let is_completed = true
            let fileOriginalName = file?.fileOriginalName?.replace(/'|"/g, '')
            let fileName = file?.fileName?.replace(/'|"/g, '')

            let postData = {
                fileUrl,
                fileName,
                fileId,
                original_file_name: fileOriginalName,
                user_id,
                user_email,
                submission_id,
                processorId
            }
            is_completed = false
            allForms.push(postData)

            let size = (file?.fileSize / 1024 / 1024).toFixed(4) + ' mb'
            sqlQuery = `INSERT INTO ${schema}.documents(id, submission_id, file_name, user_id, file_type, file_address, original_file_name, file_size, is_completed, original_file_address, created_at, updated_at) VALUES('${fileId}', '${submission_id}', '${fileName}', ${validateData(user_id)}, '${file_type}', '${fileUrl}', '${fileOriginalName}', '${size}', ${is_completed}, ${validateData(file?.originalFileUrl)}, NOW(), NOW())`

            pendingPromises.push(runQuery(postgresDB, sqlQuery))
        }

        Promise.all(pendingPromises)
            .then(async () => {

                allForms?.length && formLoop(allForms)
                console.log('after formLoop***')

                let obj = {
                    success: true,
                    errData: errArr
                }

                return apiResponse(res, 200, obj)
            })
            .catch(e => {
                console.log('error', e)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('error', e)
        return successFalse(res, e?.message)
    }
}

module.exports = {
    login,
    register,
    createSubmmission,
    generateUploadSignedUrl,
    uploadDocuments
}