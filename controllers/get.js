const _ = require('lodash')
const pdfparser = require('./pdf')
const fastcsv = require('fast-csv')
const { schema, postgresDB, storage, auth } = require('../config')
const { invoiceColumns } = require('../constants')
const { getDocumentAIProcessorsList, runQuery, apiResponse, successFalse, getAuthUrl, isNull, calculateOffset, showTableHeaderByColumn, showTableBodyByColumn, convertTitle } = require('../helpers')

const getAllProcessors = async (req, res) => {
    try {
        const projectId = await auth.getProjectId()
        let allProcessors = await getDocumentAIProcessorsList(projectId)

        let obj = { success: true, allProcessors }

        return apiResponse(res, 200, obj)
    }
    catch (e) {
        return successFalse(res, e?.message)
    }
}

const getAllSubmmissions = async (req, res) => {
    try {
        let { submissionName, processorId, dateRange, pageNo, pageSize } = req?.body
        let whereClause = ``
        pageSize = pageSize || 10
        let offset = calculateOffset(pageNo, pageSize)

        if (submissionName) {
            whereClause += ` s.submission_name ILIKE '%${submissionName}%' AND`
        }

        if (processorId) {
            whereClause += ` s.processor_id='${processorId}' AND`
        }

        if (dateRange?.start && dateRange?.end) {
            whereClause += `s.created_at BETWEEN '${dateRange?.start}' AND '${dateRange?.end}' AND`
        }

        if (whereClause?.length > 5) {
            whereClause = `WHERE ${whereClause?.slice(0, -3)}`
        }

        let sqlQuery = `SELECT s.*, CAST(COUNT(DISTINCT d.file_name) as INT) AS total_forms, ARRAY_AGG(CAST(k.confidence AS FLOAT)) AS average_confidence FROM ${schema}.submissions s
        LEFT JOIN ${schema}.documents d ON s.id = d.submission_id 
        LEFT JOIN google_doc_ai.schema_form_key_pairs AS k ON d.file_name = k.file_name
        ${whereClause}
        GROUP BY s.id order by s.created_at desc LIMIT ${pageSize} OFFSET ${offset};`

        // Run the query
        let allSubmissions = await runQuery(postgresDB, sqlQuery)

        for (var i in allSubmissions) {
            allSubmissions[i].average_confidence = _.round(_.mean(allSubmissions[i].average_confidence) * 100)
        }

        sqlQuery = `SELECT CAST(COUNT(DISTINCT s.id) as INT) AS total_submissions FROM ${schema}.submissions s
        LEFT JOIN ${schema}.documents d ON s.id = d.submission_id 
        LEFT JOIN google_doc_ai.schema_form_key_pairs AS k ON d.file_name = k.file_name
        ${whereClause}`

        let totalSubmissions = await runQuery(postgresDB, sqlQuery)

        let obj = {
            success: true,
            allSubmissions,
            totalSubmissions: totalSubmissions[0]?.total_submissions
        }

        apiResponse(res, 200, obj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

const getFilesById = async (req, res) => {
    try {
        const { submission_id } = req?.query
        const { fileName, dateRange, pageNo, pageSize } = req?.body

        if (!submission_id) {
            throw 'Submission Id is Required!'
        }

        let whereClause = ``
        let offset = calculateOffset(pageNo, pageSize)

        if (fileName) {
            whereClause += `AND d.file_name ILIKE '%${fileName}%' `
        }

        if (dateRange?.start && dateRange?.end) {
            whereClause += `AND d.created_at BETWEEN '${dateRange?.start}' AND '${dateRange?.end}'`
        }

        whereClause = `WHERE d.submission_id='${submission_id}' ${whereClause}`

        let sqlQuery = `SELECT d.*, ARRAY_AGG(CAST(s.confidence AS FLOAT)) AS average_confidence FROM ${schema}.documents d
        LEFT JOIN ${schema}.schema_form_key_pairs AS s
        ON d.file_name = s.file_name
        ${whereClause}
        GROUP BY d.id order by created_at desc LIMIT ${pageSize} OFFSET ${offset};`

        let documents = await runQuery(postgresDB, sqlQuery)

        sqlQuery = `SELECT CAST(COUNT(DISTINCT d.file_name) as INT) AS total_files FROM ${schema}.documents d
        LEFT JOIN ${schema}.schema_form_key_pairs AS s
        ON d.file_name = s.file_name
        ${whereClause}
        GROUP BY d.submission_id;`

        let totalFiles = await runQuery(postgresDB, sqlQuery)

        for (var i in documents) {
            documents[i].file_address = await getAuthUrl(documents?.[i]?.file_address, storage)
            documents[i].min_confidence = _.round(_.min(documents[i].average_confidence) * 100)
            documents[i].average_confidence = _.round(_.mean(documents[i].average_confidence) * 100)
        }

        let obj = {
            success: true,
            documents,
            totalFiles: totalFiles[0]?.total_files
        }

        apiResponse(res, 200, obj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

const getAllSubmissionsNConfidence = async (req, res) => {
    try {

        let sqlQuery = `SELECT submission_name FROM ${schema}.submissions`
        let submissions = await runQuery(postgresDB, sqlQuery)

        let subArr = []
        submissions?.map((v, i) => {
            let obj = {
                label: v?.submission_name,
                value: v?.submission_name
            }
            subArr?.push(obj)
        })
        let sqlQuery2 = `SELECT confidence FROM ${schema}.schema_form_key_pairs`
        let confidence = await runQuery(postgresDB, sqlQuery2)

        let confArr = []
        confidence?.map((v, i) => {
            let obj = {
                label: v?.confidence,
                value: v?.confidence
            }
            confArr?.push(obj)
        })
        let obj = {
            success: true,
            submissions: subArr,
            confidence: confArr
        }
        apiResponse(res, 200, obj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

const getDashboardData = async (req, res) => {

    try {
        let promises = []
        let sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.documents`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.submissions`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.schema_form_key_pairs`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT CAST(COUNT(*) AS INT) AS count FROM ${schema}.schema_form_key_pairs WHERE validated_field_value IS NOT NULL`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*)::INTEGER
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE CAST(u.confidence AS float) < (s.threshold/100.0)`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*)::INTEGER
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE CAST(u.confidence AS float) > (s.threshold/100.0)`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*)::INTEGER,s.processor_name,s.submission_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE CAST(u.confidence AS float) > (s.threshold/100.0) GROUP BY s.processor_name ,s.submission_name`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*)::INTEGER,s.processor_name,s.submission_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE CAST(u.confidence AS float) < (s.threshold/100.0) GROUP BY s.processor_name ,s.submission_name`

        promises.push(runQuery(postgresDB, sqlQuery))
        // ************ NEW QUERIES *******************
        sqlQuery = `SELECT COUNT(*)::INTEGER,s.processor_name,s.submission_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE validated_field_value IS NOT NULL GROUP BY s.processor_name ,s.submission_name`

        promises.push(runQuery(postgresDB, sqlQuery))

        sqlQuery = `SELECT COUNT(*)::INTEGER,s.processor_name,s.submission_name
        FROM ${schema}.schema_form_key_pairs AS u
        LEFT JOIN ${schema}.documents AS d ON d.file_name = u.file_name
        LEFT JOIN ${schema}.submissions AS s ON s.id = d.submission_id
        WHERE validated_field_value IS NULL GROUP BY s.processor_name ,s.submission_name`

        promises.push(runQuery(postgresDB, sqlQuery))

        // Confidence Score by Submission = Aggregates of Confidence Score we receive from all models (Shown as a percentage in Doughnut Chart)
        sqlQuery = `SELECT AVG(CAST(confidence AS float))*100.0 AS count FROM ${schema}.schema_form_key_pairs`
        promises.push(runQuery(postgresDB, sqlQuery))

        // Confidence Score by Model = Aggregates of Confidence Score we receive from models grouped by models. (Shown as a percentage in Horizontal Bar Chart)

        sqlQuery = `SELECT AVG(CAST(confidence AS float))*100.0 AS count,s.processor_name
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

const manageAndResolvePDFData = async (req, res, fileData) => {

    let isCompleted = Boolean(fileData?.is_completed)

    let { parsedPages, key_pairs } = await pdfparser.generateDataFromBigQuery(req, res)
    let hasKeyPairs = Boolean(Array.isArray(key_pairs) && key_pairs.length)
    let hasParsedPages = Boolean(Array.isArray(parsedPages) && parsedPages?.length)

    if (hasParsedPages || hasKeyPairs) {

        res.send({
            //isSchemaGenerated,
            success: true,
            //raw_data: document || {},
            parsed_data: parsedPages,
            key_pairs: key_pairs || [],
            fileData: {
                is_completed: isCompleted
            }
        })
    }
    else {
        res.send({ success: false, message: 'File still in process!', developerInfo: { message: "Did not receive data from database, looks like the A.I hasn't been applied to the file yet.", body: req?.body, query: req?.query } })
    }
}

const getPdfData = async (req, res) => {
    const file_name = req?.query?.file_name || req?.query?.file_name || req?.body?.file_name
    let [fileData] = await pdfparser.getDocumentData(file_name)
    let error = !isNull(fileData?.error) ? fileData?.error : null
    let hasError = Boolean(error)

    try {
        if (fileData?.is_completed) {
            if (!hasError) {
                manageAndResolvePDFData(req, res, fileData)
            }
            else {

                throw new Error(fileData?.error)
            }
        }
        else {
            res.send({
                success: false,
                message: "We're still processing this form, Please wait.",
                code: 'AI_FAILED'
            })
        }
    }
    catch (e) {
        console.log(e, "==> error In PDF API")
        res.send({ success: false, error: e, message: e?.message || "Something wen't wrong!" })
    }
}

const exportData = async (req, res) => {
    try {
        const { submission_id } = req?.query

        let sqlQuery = `SELECT d.file_name, e.all_fields, e.processor_name FROM google_doc_ai.documents d
        LEFT JOIN google_doc_ai.export_table e ON d.file_name = e.file_name
        WHERE d.submission_id = '${submission_id}'`

        let allData = await runQuery(postgresDB, sqlQuery)

        let arrData = []

        for (var v of allData) {
            if (v?.all_fields?.line_item?.length) {
                for (var l of v?.all_fields?.line_item) {
                    let obj = { ...invoiceColumns }
                    for (var key in obj) {
                        obj[key] = v?.all_fields[key]
                    }

                    obj['line_item'] = invoiceColumns.line_item
                    for (var k in obj['line_item']) {
                        obj['line_item'][k] = l[k]
                    }
                    arrData.push(obj)
                }
            }
            else {
                let obj = { ...invoiceColumns, ...v?.all_fields }
                arrData.push(obj)
            }
        }

        arrData = arrData?.map((v) => showTableBodyByColumn(v))

        let newObj = { arrData: arrData?.slice(0, 10), columns: showTableHeaderByColumn(invoiceColumns) }

        apiResponse(res, 200, newObj)
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

const exportDataToCSV = async (req, res) => {
    try {
        const { submission_id } = req?.query

        let sqlQuery = `SELECT d.file_name, e.all_fields, e.processor_name FROM google_doc_ai.documents d
        LEFT JOIN google_doc_ai.export_table e ON d.file_name = e.file_name
        WHERE d.submission_id = '${submission_id}'`

        let allData = await runQuery(postgresDB, sqlQuery)

        let arrData = []

        for (var v of allData) {
            if (v?.all_fields?.line_item?.length) {
                for (var l of v?.all_fields?.line_item) {
                    let obj = { ...invoiceColumns }
                    for (var key in obj) {
                        obj[key] = v?.all_fields[key]
                    }

                    obj['line_item'] = invoiceColumns.line_item
                    for (var k in obj['line_item']) {
                        obj['line_item'][k] = l[k]
                    }
                    arrData.push(obj)
                }
            }
            else {
                let obj = { ...invoiceColumns, ...v?.all_fields }
                arrData.push(obj)
            }
        }

        arrData = arrData?.map((v) => showTableBodyByColumn(v))
        let columns = showTableHeaderByColumn(invoiceColumns)

        let csvStream = fastcsv.format({ headers: true })
        res.setHeader('Content-disposition', 'attachment; filename=data.csv')
        res.set('Content-Type', 'text/csv')
        csvStream.pipe(res).on('end', function () {
            res.end()
        })

        for (var v of arrData) {
            let obj = {}
            for (var i in v) {
                obj[convertTitle(columns[i])] = v[i] || '-'
            }

            csvStream.write(obj)
        }

        csvStream.end()
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message || e)
    }
}

module.exports = {
    getAllProcessors,
    getAllSubmmissions,
    getFilesById,
    getPdfData,
    getDashboardData,
    exportData,
    exportDataToCSV,
    getAllSubmissionsNConfidence
}