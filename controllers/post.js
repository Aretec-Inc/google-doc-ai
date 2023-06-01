
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const aws = require('aws-sdk')
const bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
const moment = require('moment')
const axios = require('axios')
const { Storage } = require('@google-cloud/storage')
const { runQuery, apiResponse, successFalse, validateData, formLoop, isNull, downloadPublicFile, getAuthUrl } = require('../helpers')
const registerSecret = 'verify'
const { postgresDB, storage, schema } = require('../config')
const pdfKeyPair = require('../helpers/pdf_keyPair')
const { generateBodyResponse } = require('../services/tokenService')

const docAIBucket = storage.bucket(process.env?.storage_bucket || `doc_ai_form`)

let minutes = process.env.NODE_ENV === 'production' ? 15 : 60

// const secretKey = 'access_token'
const secretKey = process.env?.secretKey
const BUFFER_SIZE = 8192
const buffer = Buffer.alloc(BUFFER_SIZE)

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
        const { processorId, processorName, submissionName, threshold } = req.body
        const id = uuidv4()

        if (!processorId || !processorName || !submissionName) {
            return successFalse(res, 'Please Provide All Fields!', 500)
        }

        const user_id = '471729f9-d14d-4632-868f-16b7d19656ec'

        let sqlQuery = `INSERT INTO ${schema}.submissions(id, processor_id, submission_name, processor_name, user_id, status, threshold, created_at)
            VALUES ('${id}', ${validateData(processorId)}, ${validateData(submissionName)}, ${validateData(processorName)}, ${validateData(user_id)}, 'Processing', ${threshold}, NOW());`

        // Run the query
        runQuery(postgresDB, sqlQuery)
            .then(async (row) => {
                let obj = {
                    success: true,
                    message: 'Submission Created Successfully!',
                    id,
                    processorId,
                    processorName
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
        let Origin = process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN : 'http://localhost:3000'
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

        const [url] = await docAIBucket.file(`${fileOriginalName}`).getSignedUrl(options)
        let fileUrl = `gs://${docAIBucket.name}/${fileOriginalName}`

        let signedURI = await axios.post(`${url}`, {}, {
            headers: { 'Content-Type': contentType, 'x-goog-resumable': 'start', 'Origin': Origin }
        })

        return generateBodyResponse({ success: true, sessionUrl: signedURI.headers.location, fileUrl: fileUrl, fileType: contentType, fileId: id, Origin }, res)
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
        let { submission_id, processorId, processorName, files } = req.body

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

            // let fileId = uuidv4()

            // fileName = `${fileId}-${fileName}`

            // console.log('fileName', fileName)

            let postData = {
                fileUrl,
                fileName,
                fileId,
                original_file_name: fileOriginalName,
                user_id,
                user_email,
                submission_id,
                processorId,
                processorName
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

const updateKeyPairs = async (req, res) => {
    try {
        let body = req?.body
        let id = body?.id
        let validated_field_name = body?.validated_field_name
        let validated_field_value = body?.validated_field_value

        const hasFieldName = !isNull(validated_field_name)
        const hasFieldValue = !isNull(validated_field_value)

        if (id && (hasFieldName || hasFieldValue)) {

            let shouldUpdate = await pdfKeyPair.shouldFieldUpdate(req, postgresDB)
            console.log(shouldUpdate, '<==shouldUpdate')
            if (shouldUpdate) {
                const updateResults = await pdfKeyPair.updateField(req, postgresDB)
                return res.status(200).send({ success: true, res: typeof updateResults?.flat == 'function' ? updateResults?.flat() : null })
            }
            else {
                return res.status(406).send({ success: false, message: 'The field is already reconciled' })
            }
        }
        else {
            return res.status(402).send({ success: false, message: 'Please write updated value..', developerInfo: { message: 'Missing params, Required Params Are: id && (validated_field_name || validated_field_value)', body: body } })
        }
    }
    catch (e) {
        return res.status(500).send({ success: false, error: e, message: e?.message || "Something wen't wrong!" })
    }
}

const validateServiceKeyGCS = async (req, res) => {
    try {
        const file = req?.file

        console.log('file', file)

        if (!file) {
            throw 'Please Provide a file!'
        }

        const gcsStorage = new Storage({ keyFilename: file?.path })

        let [buckets] = await gcsStorage.getBuckets()

        buckets = buckets?.map(v => v?.id)?.filter(v => !v?.endsWith('cloudbuild') && !v?.startsWith('artifacts.'))

        console.log('file', buckets)

        return apiResponse(res, 200, { success: true, buckets, filePath: file?.path })
    }
    catch (e) {
        console.log('e', e)

        return successFalse(res, 'Unable to Verify the Service Key!', 500)
    }
}

const getBucketData = async (req, res) => {
    try {
        const { bucket, filePath } = req?.body

        console.log('bucket, filePath', bucket, filePath)

        if (!bucket || !filePath) {
            throw 'Please Provide all fields!'
        }

        const gcsStorage = new Storage({ keyFilename: filePath })

        let [files, , folders] = await gcsStorage.bucket(bucket).getFiles({ autoPaginate: false, delimiter: '/', prefix: '' })

        files = files.filter(file => file?.name?.endsWith('.pdf'))

        files = files?.map((v) => {
            return {
                id: v?.id,
                name: v?.name,
                type: 'file',
                selfLink: v?.metadata?.selfLink
            }
        })

        // let folders = folders?.prefixes?.map()

        console.log('***', folders?.prefixes)

        return apiResponse(res, 200, { success: true, files })
    }
    catch (e) {
        console.log('e', e)

        return successFalse(res, e?.message || e, 500)
    }
}

const downloadAndUploadFiles = async (req, res) => {
    try {
        const { bucket, filePath, files } = req?.body

        if (!bucket || !filePath || !files?.length) {
            throw 'Please Provide all fields!'
        }

        if (!fs.existsSync(bucket)) {
            fs.mkdirSync(bucket)
        }

        const gcsStorage = new Storage({ keyFilename: filePath })
        let gcsBucket = gcsStorage.bucket(bucket)
        let promises = []
        let allFiles = []

        for (var file of files) {
            let id = uuidv4()
            let fileName = `${id}-${file?.name}`
            let destination = `${bucket}/${fileName}`
            promises.push(gcsBucket.file(file?.name).download({ destination }))
            allFiles.push({ destination, fileId: id, fileType: 'application/pdf', fileOriginalName: file?.name, fileName })
        }

        await Promise.allSettled(promises)
            .then(() => {
                console.log('download done')
                uploadAndProcessFiles(allFiles, bucket, req?.body)

                try {
                    fs.unlinkSync(filePath)
                    console.log('service key deleted')
                }
                catch (e) {
                    console.log('err', e)
                }
            })


        return apiResponse(res, 200, { success: true })
    }
    catch (e) {
        console.log('e', e)

        return successFalse(res, e?.message || e, 500)
    }
}

const uploadAndProcessFiles = (files, folder, body) => {
    let promises = []
    for (var i in files) {
        promises.push(new Promise((resolve, reject) => {
            let filePath = files[i]?.destination
            let bytesRead = fs.readFileSync(files[i]?.destination, buffer)
            const blob = docAIBucket.file(filePath)
            let fileUrl = `gs://${docAIBucket.name}/${filePath}`
            files[i].fileUrl = fileUrl

            let blobStream = blob.createWriteStream()

            blobStream.on('finish', async () => {
                console.log('done')
                resolve()
            })
            blobStream.on('error', async (e) => {
                console.log('erro')
                reject()
            })
            blobStream.end(bytesRead)
        }))
    }

    Promise.allSettled(promises)
        .then(() => {
            try {
                fs.rmdirSync(folder, { recursive: true })
            }
            catch (e) {

            }
            console.log('updated')

            let obj = {
                ...body,
                files
            }
            let req = {
                body: obj
            }

            uploadDocuments(req)
        })
}

const getS3BucketData = async (req, res) => {
    try {
        let { accessKey, secretKey, bucketName, region } = req?.body
        accessKey = accessKey?.replace(' ', '+')
        secretKey = secretKey?.replace(' ', '+')

        let s3 = new aws.S3({
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: region || 'us-east-1'
        })

        const listParams = {
            Bucket: bucketName,
        }

        s3.listObjectsV2(listParams, async function (err, data) {
            if (err) {
                console.log('err', err)
                return successFalse(res, err?.message)
            }
            const fileObjArr = []
            let promises = []
            data.Contents = data?.Contents?.filter(v => v?.Key?.endsWith('.pdf'))
            for (const [index, fileObj] of (data?.Contents)?.entries()) {
                promises.push(
                    new Promise((resolve, reject) => {
                        if (fileObj?.Size > 0) {
                            let params = { Bucket: bucketName, Key: fileObj.Key }
                            s3.getSignedUrl('getObject', params, (err, url) => {
                                fileObj.url = url
                                resolve(fileObjArr.push(fileObj))
                            })
                        }
                        else {
                            resolve(fileObjArr.push({ ...fileObj }))
                        }
                    })
                )
            }
            await Promise.all(promises).then(() => {
                let files = fileObjArr?.map((v) => {
                    return {
                        id: v?.ETag,
                        name: v?.Key?.replace(/\//g, '-'),
                        size: v?.Size,
                        fileUrl: v?.url
                    }
                })
                let obj = {
                    success: true,
                    files,
                    message: 'Successfully Get!'
                }
                return apiResponse(res, 200, obj)
            })
        })
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message)
    }
}

const downloadAndUploadS3Files = async (req, res) => {
    try {
        const { files } = req?.body

        let folder = `s3-${uuidv4()}`

        if (!files?.length) {
            throw 'Please Provide all fields!'
        }

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }

        let promises = []
        let allFiles = []

        for (var file of files) {
            let id = uuidv4()
            let name = file?.name?.replace(/\//g, '-')
            let fileName = `${id}-${name}`
            let destination = `${folder}/${fileName}`
            promises.push(downloadPublicFile(file?.fileUrl, destination))
            allFiles.push({ destination, fileId: id, fileType: 'application/pdf', fileOriginalName: name, fileName, size: file?.size })
        }

        await Promise.allSettled(promises)
            .then(() => {
                console.log('download done')
                uploadAndProcessFiles(allFiles, folder, req?.body)
            })

        return apiResponse(res, 200, { success: true })
    }
    catch (e) {
        console.log('e ****', e)

        return successFalse(res, e?.message || e, 500)
    }
}

const getDashboardData = async (req, res) => {
    const { submission, confidence } = req?.body
    console.log("POST ==>", submission, confidence)
    try {
        let promises = []
        let sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.documents`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.submissions `

        promises.push(runQuery(postgresDB, sqlQuery))

        if (submission) {
            sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.schema_form_key_pairs AS u
            LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
            LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
            WHERE s.submission_name = '${submission}'`
        } else {
            sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.schema_form_key_pairs`
        }

        promises.push(runQuery(postgresDB, sqlQuery))

        if (submission) {
            sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.schema_form_key_pairs AS u
            LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
            LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
            WHERE s.submission_name = '${submission}' AND validated_field_value IS NOT NULL`
        } else {
            sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.schema_form_key_pairs  WHERE validated_field_value IS NOT NULL`
        }


        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*):: INTEGER
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE CAST(u.confidence AS float) < (s.threshold / 100.0)`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*):: INTEGER
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE CAST(u.confidence AS float) > (s.threshold / 100.0)`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*):: INTEGER, s.processor_name, s.submission_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE CAST(u.confidence AS float) > (s.threshold / 100.0) GROUP BY s.processor_name, s.submission_name`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*):: INTEGER, s.processor_name, s.submission_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE CAST(u.confidence AS float) < (s.threshold / 100.0) GROUP BY s.processor_name, s.submission_name`

        promises.push(runQuery(postgresDB, sqlQuery))
        // ************ NEW QUERIES *******************
        sqlQuery = `SELECT COUNT(*):: INTEGER, s.processor_name, s.submission_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE validated_field_value IS NOT NULL GROUP BY s.processor_name, s.submission_name`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*):: INTEGER, s.processor_name, s.submission_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE validated_field_value IS NULL GROUP BY s.processor_name, s.submission_name`

        promises.push(runQuery(postgresDB, sqlQuery))

        // Confidence Score by Submission = Aggregates of Confidence Score we receive from all models (Shown as a percentage in Doughnut Chart)
        if (confidence) {
            sqlQuery = `SELECT AVG(CAST(confidence AS float)) * 100.0 AS count FROM ${schema}.schema_form_key_pairs AS u
            LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
            LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
            WHERE s.submission_name = '${confidence}'`
        }
        else {
            sqlQuery = `SELECT AVG(CAST(confidence AS float)) * 100.0 AS count FROM ${schema}.schema_form_key_pairs`
        }
        promises.push(runQuery(postgresDB, sqlQuery))

        // Confidence Score by Model = Aggregates of Confidence Score we receive from models grouped by models. (Shown as a percentage in Horizontal Bar Chart)

        sqlQuery = `SELECT AVG(CAST(confidence AS float)) * 100.0 AS count, s.processor_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        GROUP BY s.processor_name`
        promises.push(runQuery(postgresDB, sqlQuery))

        // ************ NEW QUERIES END*******************

        let [documents, submissions, totalFields, totalFixes, belowThreshold, aboveThreshold, aboveThresholdModel, belowThresholdModel, totalFieldChangeGroupByModel, totalFieldsGroupByModel, overAllConfidence, confByModel] = await Promise.allSettled(promises)

        totalFields = totalFields?.value[0]?.count
        totalFixes = totalFixes?.value[0]?.count
        // Accuracy By Submission = # of fields changed / the total number of fields (Shown as a percentage in Doughnut Chart)
        let accBySubmission = (totalFixes / totalFields) * 100





        let accuracy = 100 - ((totalFixes / totalFields) * 100)?.toFixed(1)

        // BELOW THRESHOLD
        // 100 - (Total fields below threshold / Total Fields * 100)
        let belowThresholdValue = 100 - ((belowThreshold?.value[0]?.count / totalFields) * 100)?.toFixed(1)

        // ABOVE THRESHOLD
        // Transcription Accuracy - Total fields transcribed above threshold
        // let aboveThresholdValue = totalFields - aboveThreshold?.value[0]?.count
        let aboveThresholdValue = totalFields - aboveThreshold?.value[0]?.count

        let aboveArr = []
        totalFieldsGroupByModel?.value?.map((v, i) => {
            let obj = {
                processor_name: v?.processor_name,
                count: v?.count,
                submission_name: v?.submission_name,
                mode: 'Model Accuracy'
            }
            return (
                aboveArr?.push(obj)
            )
        })

        let belowArr = []
        totalFieldChangeGroupByModel?.value?.map((v, i) => {
            let obj = {
                processor_name: v?.processor_name,
                count: v?.count,
                submission_name: v?.submission_name,
                mode: 'Model Review'
            }
            return (
                belowArr?.push(obj)
            )
        })

        let confidenceByModelFinalSchema = []
        confByModel?.value?.map((v, i) => {
            let obj = {
                processor_name: v?.processor_name,
                count: v?.count,
                mode: 'Model Accuracy'
            }
            return (
                confidenceByModelFinalSchema?.push(obj)
            )
        })

        confByModel?.value?.map((v, i) => {
            let obj = {
                processor_name: v?.processor_name,
                count: 100 - v?.count,
                mode: 'Model Review'
            }
            return (
                confidenceByModelFinalSchema?.push(obj)
            )
        })


        let obj = {
            success: true,
            documents: documents?.value[0]?.count,
            submissions: submissions?.value[0]?.count,
            overAllConfidence: overAllConfidence?.value[0]?.count,
            accuracy,
            belowThresholdValue,
            aboveThresholdValue,
            aboveArr,
            belowArr,
            totalFixes,
            accBySubmission,
            confidenceByModelFinalSchema,
            aboveThresholdModel: aboveThresholdModel?.value,
            belowThresholdModel: belowThresholdModel?.value
        }

        apiResponse(res, 200, obj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

// const saveData = async (sqlQuery, filePath) => {
//     try {
//         const data = await runQuery(postgresDB, sqlQuery)
//         fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
//         console.log('Data written to file')
//     }
//     catch (err) {
//         console.error(err)
//     }
// }

// const addDummyData = async () => {
//     let path = `data/expenses`

//     let sqlQuery = `SELECT id, submission_id, file_name, user_id, file_type, file_address, original_file_name, file_size, is_validate, md5, is_deleted, is_verified, is_completed, number_of_attempts, error, original_file_address, created_at, updated_at
// 	FROM google_doc_ai.documents WHERE submission_id='9603b87d-3c8d-4d2b-aebf-976f77ad735b';`

//     let filePath = `${path}/data.json`

//     saveData(sqlQuery, filePath)

//     sqlQuery = `SELECT s.file_name, field_name, field_value, time_stamp, validated_field_name, validated_field_value, updated_date, confidence, updated_by, key_x1, key_x2, key_y1, key_y2, value_x1, value_x2, value_y1, value_y2, page_number, s.id, type, field_name_confidence, field_value_confidence, dlp_info_type, dlp_match_likelihood, nullable, data_types, column_name, width, height, w, h, name_width, name_height, value_width, value_height
// 	FROM google_doc_ai.schema_form_key_pairs s
// 	LEFT JOIN google_doc_ai.documents d ON d.file_name = s.file_name
// 	WHERE d.submission_id='9603b87d-3c8d-4d2b-aebf-976f77ad735b';`

//     filePath = `${path}/key_form.json`

//     saveData(sqlQuery, filePath)

//     sqlQuery = `SELECT e.file_name, processor_name, processor_id, all_fields, e.created_at
// 	FROM google_doc_ai.export_table e
// 	LEFT JOIN google_doc_ai.documents d ON d.file_name = e.file_name
// 	WHERE d.submission_id='9603b87d-3c8d-4d2b-aebf-976f77ad735b';`

//     filePath = `${path}/export_table.json`

//     saveData(sqlQuery, filePath)

//     sqlQuery = `SELECT p.file_name, pages_count, entities_count, text, schema_id
// 	FROM google_doc_ai.pdf_documents p
// 	LEFT JOIN google_doc_ai.documents d ON d.file_name = p.file_name
// 	WHERE d.submission_id='9603b87d-3c8d-4d2b-aebf-976f77ad735b';`

//     filePath = `${path}/pdf_documents.json`

//     saveData(sqlQuery, filePath)

//     sqlQuery = `SELECT p.id, p.file_name, dimensions, "pageNumber", paragraphs
// 	FROM google_doc_ai.pdf_pages p
// 	LEFT JOIN google_doc_ai.documents d ON d.file_name = p.file_name
// 	WHERE d.submission_id='9603b87d-3c8d-4d2b-aebf-976f77ad735b';`

//     filePath = `${path}/pdf_pages.json`

//     saveData(sqlQuery, filePath)
// }

// addDummyData()

// const downloadPdfs = async () => {
//     const invoices = require('../data/health/data.json')
//     let path = `data/health/files`

//     for (var v of invoices) {
//         let authUrl = await getAuthUrl(v?.file_address, storage)
//         downloadPublicFile(authUrl, `${path}/${v?.file_name}`)
//     }
// }

// downloadPdfs()

module.exports = {
    login,
    register,
    createSubmmission,
    generateUploadSignedUrl,
    uploadDocuments,
    updateKeyPairs,
    validateServiceKeyGCS,
    getBucketData,
    downloadAndUploadFiles,
    getS3BucketData,
    downloadAndUploadS3Files,
    getDashboardData
}