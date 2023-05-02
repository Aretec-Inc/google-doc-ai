
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
const moment = require('moment')
const fs = require('fs')
const { downloadFile, uploadFileToStorage, categoryClassify, checkDocumentQuality,typeTextClassify } = require('../helpers')
const { runQuery, apiResponse, successFalse, arrayIntoPostgresqlArray } = require('virgin-helpers')
const { contextOltp, service_key, languageClient, storage, dlpClient, projectId } = require('../config')
const formBucket = storage.bucket(`test_sent`)
const ObjectsToCsv = require('objects-to-csv');
// const formBucket = storage.bucket(`elaborate-howl-285701_context_primary`)

const axios = require('axios')
const path = require('path')
const { fstat } = require('fs')

const upload = async (req, res) => {
    try {
        let files = req.files
        let user_id = req?.body?.user_id
        console.log(req?.body, '<== body')
        if (!user_id) {
            return successFalse(res, 'user_id is required', 500)
        }
        if (!files?.length) {
            return successFalse(res, 'no files to upload', 500)
        }
        let uploadPromises = []
        files?.forEach(file => {
            const file_id = uuidv4()
            uploadPromises.push(uploadFileToStorage(file?.path, file?.originalname, file_id, storage))
        });
        let pdf = await Promise.allSettled(uploadPromises)
        let categoriesPromises = []
        files = files?.map((file, index) => {

            file.fileId = pdf[index]?.value?.file_id
            file.fileUrl = pdf[index]?.value?.fileUrl
            categoriesPromises.push(categoryClassify(file.fileUrl))
            file.fileType = 'form'
            file.originalFileUrl = file.fileUrl
            return file
        })

        let categories = await Promise.allSettled(categoriesPromises)

        let filesData = {
            user_id: "6911e06f-7e44-4d43-adb0-75b595ebfe2c",
            folder_id: "92364af1-0a26-4f13-b9d2-c8470fc4c4e7",
            template_file_name: "null-null",
            table_name: "Virgin_Island_App2_d16547d4_6d32_46e8_baf8_360a746005da.null",
            project_name: "Virgin_Island_App2",
            project_id: "d16547d4-6d32-46e8-baf8-360a746005da",
            user_email: "myasirkhan575@gmail.com",
            template_id: null,
            processorId: null,
            is_custom: null,
            retension: 100
        }
        filesData.files = files
        const sumission_id = uuidv4()
        let file_names = files?.map(file => file?.originalname)
        let submissionInsert = `INSERT INTO virgin_island.submissions(
            submission_id, documents, status, created_at,user_id)
            VALUES ('${sumission_id}', ${arrayIntoPostgresqlArray(file_names)}, 'processing', NOW(),'${user_id}')`
        await runQuery(contextOltp, submissionInsert)
        let url = 'https://artifact-api-2my7afm7yq-ue.a.run.app/api/artifact/'
        let result = await axios.post(url, filesData)
        let insertPromises = []
        if (result?.data?.success) {
            result?.data?.artifactIds?.map((artifactId, index) => {
                let sqlQuery = `INSERT INTO virgin_island.documents(file_id, submission_id, document_name, document_type, status, created_at, updated_at,case_category,category_confidence ,is_deleted) VALUES ('${artifactId}', '${sumission_id}', '${files?.[index]?.originalname}', '${files?.[index]?.mimetype}', 'submitted', NOW(), NOW(),'${categories[index]?.value?.label}',${categories[index]?.value?.confidence},false)`
                // file_names.push(files?.[index]?.originalname)
                insertPromises.push(runQuery(contextOltp, sqlQuery))
            })
            await Promise.allSettled(insertPromises)
            let updateQuery = `UPDATE virgin_island.submissions set status = 'completed',completed_date = NOW() where submission_id='${sumission_id}'`
            await runQuery(contextOltp, updateQuery)
        }
        console.log(result, '<== result')
        let obj = {
            success: true,
            artifactIds: result?.data?.artifactIds,
            errData: result?.data?.errData
        }
        return apiResponse(res, 201, obj)
    }
    catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error, 500)
    }

}
const uploadNew = async (req, res) => {
    try {
        let files = req.files
        let IDFiles = req.id_files
        let IncomeFiles = req.income_files
        let ExpenseFiles = req.expense_files
        let user_id = req?.body?.user_id
        console.log(req?.body, '<== body')
        if (!user_id) {
            return successFalse(res, 'user_id is required', 500)
        }
        if (!files?.length) {
            return successFalse(res, 'no files to upload', 500)
        }
        let uploadPromises = []
        let uploadPromisesID = []
        let uploadPromisesIncome = []
        let uploadPromisesExpense = []
        files?.forEach(file => {
            const file_id = uuidv4()
            uploadPromises.push(uploadFileToStorage(file?.path, file?.originalname, file_id, storage))
        });
        IDFiles?.forEach(file => {
            const file_id = uuidv4()
            uploadPromisesID.push(uploadFileToStorage(file?.path, file?.originalname, file_id, storage))
        });
        IncomeFiles?.forEach(file => {
            const file_id = uuidv4()
            uploadPromisesIncome.push(uploadFileToStorage(file?.path, file?.originalname, file_id, storage))
        });
        ExpenseFiles?.forEach(file => {
            const file_id = uuidv4()
            uploadPromisesExpense.push(uploadFileToStorage(file?.path, file?.originalname, file_id, storage))
        });
        let pdf = await Promise.allSettled(uploadPromises)
        let pdfID = await Promise.allSettled(uploadPromisesID)
        let pdfIncome = await Promise.allSettled(uploadPromisesIncome)
        let pdfExpense = await Promise.allSettled(uploadPromisesExpense)
        let categoriesPromises = []
        files = files?.map((file, index) => {

            file.fileId = pdf[index]?.value?.file_id
            file.fileUrl = pdf[index]?.value?.fileUrl
            categoriesPromises.push(categoryClassify(file.fileUrl))
            file.fileType = 'form'
            file.originalFileUrl = file.fileUrl
            return file
        })
        IDFiles = IDFiles?.map((file, index) => {

            file.fileId = pdfID[index]?.value?.file_id
            file.fileUrl = pdfID[index]?.value?.fileUrl
            // categoriesPromises.push(categoryClassify(file.fileUrl))
            file.fileType = 'form'
            file.originalFileUrl = file.fileUrl
            return file
        })
        IncomeFiles = IncomeFiles?.map((file, index) => {

            file.fileId = pdfIncome[index]?.value?.file_id
            file.fileUrl = pdfIncome[index]?.value?.fileUrl
            // categoriesPromises.push(categoryClassify(file.fileUrl))
            file.fileType = 'form'
            file.originalFileUrl = file.fileUrl
            return file
        })
        ExpenseFiles = ExpenseFiles?.map((file, index) => {

            file.fileId = pdfExpense[index]?.value?.file_id
            file.fileUrl = pdfExpense[index]?.value?.fileUrl
            // categoriesPromises.push(categoryClassify(file.fileUrl))
            file.fileType = 'form'
            file.originalFileUrl = file.fileUrl
            return file
        })

        let categories = await Promise.allSettled(categoriesPromises)

        let filesData = {
            user_id: "6911e06f-7e44-4d43-adb0-75b595ebfe2c",
            folder_id: "92364af1-0a26-4f13-b9d2-c8470fc4c4e7",
            template_file_name: "null-null",
            table_name: "Virgin_Island_App2_d16547d4_6d32_46e8_baf8_360a746005da.null",
            project_name: "Virgin_Island_App2",
            project_id: "d16547d4-6d32-46e8-baf8-360a746005da",
            user_email: "myasirkhan575@gmail.com",
            template_id: null,
            processorId: null,
            is_custom: null,
            retension: 100
        }
        let filesDataIncome = {
            folder_id: "1c956e27-cc31-40c9-8273-b2bd3cf2ee75",
            is_custom: true,
            processorId: "cf3d997d72d9ac64",
            project_id: "b861f9c4-4d06-4640-9913-16ae035c7814",
            project_name: "VIRGIN_ICOME_PARSER",
            retension: 100,
            table_name: "VIRGIN_ICOME_PARSER_b861f9c4_4d06_4640_9913_16ae035c7814.Virgin_Income_Parser_55a17c32_ff8f_4c0f_a11c_4bea795c50cb",
            template_file_name: "55a17c32-ff8f-4c0f-a11c-4bea795c50cb-null",
            template_id: "55a17c32-ff8f-4c0f-a11c-4bea795c50cb",
            user_email: "myasirkhan575@gmail.com",
            user_id: "6911e06f-7e44-4d43-adb0-75b595ebfe2c",
        }
        let filesDataExpense = {
            folder_id: "ef68b9c7-ca23-4910-bfbd-08ce79a89785",
            is_custom: true,
            processorId: "6edcaf39cbe55269",
            project_id: "6b414e07-320a-44c7-bda8-b81dbc27f7b6",
            project_name: "VIRGIN_EXPENSE_PARSE",
            retension: 100,
            table_name: "VIRGIN_EXPENSE_PARSE_6b414e07_320a_44c7_bda8_b81dbc27f7b6.Virgin_expense_parser_ea4c3650_3306_42aa_b216_46d4907fdc6f",
            template_file_name: "ea4c3650-3306-42aa-b216-46d4907fdc6f-null",
            template_id: "ea4c3650-3306-42aa-b216-46d4907fdc6f",
            user_email: "myasirkhan575@gmail.com",
            user_id: "6911e06f-7e44-4d43-adb0-75b595ebfe2c",
        }
        filesData.files = files
        filesDataIncome.files = IncomeFiles
        filesDataExpense.files = ExpenseFiles
        const sumission_id = uuidv4()
        let file_names = files?.map(file => file?.originalname)
        let file_income = IncomeFiles?.map(file => file?.originalname)
        let file_expense = ExpenseFiles?.map(file => file?.originalname)
        let submissionInsert = `INSERT INTO virgin_island.submissions(
            submission_id, documents, status, created_at,user_id)
            VALUES ('${sumission_id}', ${arrayIntoPostgresqlArray(file_names)}, 'processing', NOW(),'${user_id}')`
        await runQuery(contextOltp, submissionInsert)
        let url = 'https://artifact-api-2my7afm7yq-ue.a.run.app/api/artifact/'
        let result = await axios.post(url, filesData)
        // let resultID = await axios.post(url, filesData)
        let resultIncome = await axios.post(url, filesDataIncome)
        let resultExpense = await axios.post(url, filesDataExpense)
        let insertPromises = []
        let insertPromisesincome = []
        let insertPromisesExpense = []
        if (result?.data?.success) {
            result?.data?.artifactIds?.map((artifactId, index) => {
                let sqlQuery = `INSERT INTO virgin_island.documents(file_id, submission_id, document_name, document_type, status, created_at, updated_at,case_category,category_confidence ,is_deleted) VALUES ('${artifactId}', '${sumission_id}', '${files?.[index]?.originalname}', '${files?.[index]?.mimetype}', 'submitted', NOW(), NOW(),'${categories[index]?.value?.label}',${categories[index]?.value?.confidence},false)`
                // file_names.push(files?.[index]?.originalname)
                insertPromises.push(runQuery(contextOltp, sqlQuery))
            })
            await Promise.allSettled(insertPromises)

        }
        if (resultIncome?.data?.success) {
            resultIncome?.data?.artifactIds?.map((artifactId, index) => {
                let sqlQuery = `INSERT INTO virgin_island.documents(file_id, submission_id, document_name, document_type, status, created_at, updated_at,case_category,category_confidence ,is_deleted) VALUES ('${artifactId}', '${sumission_id}', '${files?.[index]?.originalname}', '${files?.[index]?.mimetype}', 'submitted', NOW(), NOW(),'${categories[index]?.value?.label}',${categories[index]?.value?.confidence},false)`
                // file_names.push(files?.[index]?.originalname)
                insertPromisesincome.push(runQuery(contextOltp, sqlQuery))
            })
            await Promise.allSettled(insertPromisesincome)

        }
        if (resultExpense?.data?.success) {
            resultExpense?.data?.artifactIds?.map((artifactId, index) => {
                let sqlQuery = `INSERT INTO virgin_island.documents(file_id, submission_id, document_name, document_type, status, created_at, updated_at,case_category,category_confidence ,is_deleted) VALUES ('${artifactId}', '${sumission_id}', '${files?.[index]?.originalname}', '${files?.[index]?.mimetype}', 'submitted', NOW(), NOW(),'${categories[index]?.value?.label}',${categories[index]?.value?.confidence},false)`
                // file_names.push(files?.[index]?.originalname)
                insertPromisesExpense.push(runQuery(contextOltp, sqlQuery))
            })
            await Promise.allSettled(insertPromisesExpense)

        }
        let updateQuery = `UPDATE virgin_island.submissions set status = 'completed',completed_date = NOW() where submission_id='${sumission_id}'`
        await runQuery(contextOltp, updateQuery)
        console.log(result, '<== result')
        let obj = {
            success: true,
            artifactIds: result?.data?.artifactIds,
            errData: result?.data?.errData
        }
        return apiResponse(res, 201, obj)
    }
    catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error, 500)
    }

}

const uploadApplication = async (req, res) => {
    try {
        let file = req?.file
        console.log("FILE===>", file)
        let error_message
        let application_type = req?.body?.application_type
        let user_id = req?.body?.user_id
        if (!file) {
            return successFalse(res, 'no files to upload', 500)
        }
        let doc_quality = await checkDocumentQuality(file?.path)
        if (doc_quality?.confidence < 0.7) {
            // try {
            //     fs.unlinkSync(file?.path)
            // } catch (error) {
            //     console.log(error)
            // }
            error_message = `${file?.originalname} document quality is poor; the Document is ${doc_quality?.reason}. You may continue or upload a higher quality document.`
            // let obj = { success: true, inCorrectMessage: `${file?.originalname} Document quality is poor; the Document is . You may continue or upload a higher quality document.` }
            // return apiResponse(res, 200, obj)
        }
        let file_id = uuidv4()
        let uploaded_file = await uploadFileToStorage(file?.path, file?.originalname, file_id, storage)

        file.fileId = file_id
        file.fileUrl = uploaded_file?.fileUrl
        file.fileType = 'form'
        file.originalFileUrl = file.fileUrl
        let categories = await typeTextClassify(doc_quality?.text)
        // if(application_type=='MAP Application')
        // {
            if (categories?.label != application_type) {
                try {
                    await fs.unlinkSync(file?.path)
                } catch (error) {
                    console.log(error)
                }
                let obj = { success: true, inCorrectMessage: `The application type is incorrect, please upload ${application_type}` }
                return apiResponse(res, 200, obj)
            }
        // }


        let filesData = {
            user_id: "6911e06f-7e44-4d43-adb0-75b595ebfe2c",
            folder_id: "92364af1-0a26-4f13-b9d2-c8470fc4c4e7",
            template_file_name: "null-null",
            table_name: "Virgin_Island_App2_d16547d4_6d32_46e8_baf8_360a746005da.null",
            project_name: "Virgin_Island_App2",
            project_id: "d16547d4-6d32-46e8-baf8-360a746005da",
            user_email: "myasirkhan575@gmail.com",
            template_id: null,
            processorId: null,
            is_custom: null,
            retension: 100
        }
        filesData.files = [file]
        const sumission_id = uuidv4()
        let file_names = filesData.files?.map(file => file?.originalname)
        let submissionInsert = `INSERT INTO virgin_island.submissions(
            submission_id, documents, status, created_at,user_id)
            VALUES ('${sumission_id}', ${arrayIntoPostgresqlArray(file_names)}, 'processing', NOW(),'${user_id}')`
        // await runQuery(contextOltp, submissionInsert)
        let url = 'https://artifact-api-2my7afm7yq-ue.a.run.app/api/artifact/'
        let result = await axios.post(url, filesData)
        // let insertPromises = []
        // if (result?.data?.success) {
        //     result?.data?.artifactIds?.map((artifactId, index) => {
        //         let sqlQuery = `INSERT INTO virgin_island.documents(file_id, submission_id, document_name, document_type, status, created_at, updated_at,case_category,category_confidence ,is_deleted) VALUES ('${artifactId}', '${sumission_id}', '${filesData.files?.[index]?.originalname}', '${filesData.files?.[index]?.mimetype}', 'submitted', NOW(), NOW(),'${categories.label}',${categories.confidence},false)`
        //         // file_names.push(files?.[index]?.originalname)
        //         insertPromises.push(runQuery(contextOltp, sqlQuery))
        //     })
        //     await Promise.allSettled(insertPromises)
        //     let updateQuery = `UPDATE virgin_island.submissions set status = 'completed',completed_date = NOW() where submission_id='${sumission_id}'`
        //     await runQuery(contextOltp, updateQuery)
        // }
        try {
            fs.unlinkSync(file?.path)
        } catch (error) {
            console.log(error)
        }
        let obj = {
            success: true,
            artifactIds: result?.data?.artifactIds,
            file_names,
            errData: result?.data?.errData,
            inCorrectMessage:error_message
        }
        return apiResponse(res, 200, obj)

    } catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error, 500)
    }

}

const submitApplication = async (req, res) => {
    try {
        let user_id = req?.body?.user_id
        let file_id = req?.body?.file_id
        let file_original_name = req?.body?.file_original_name
        let application_type = req?.body?.application_type
        const sumission_id = uuidv4()
        let submissionInsert = `INSERT INTO virgin_island.submissions(
            submission_id, documents, status, created_at,user_id)
            VALUES ('${sumission_id}', ${arrayIntoPostgresqlArray([file_original_name])}, 'processing', NOW(),'${user_id}')`
        await runQuery(contextOltp, submissionInsert)
        let sqlQuery = `INSERT INTO virgin_island.documents(file_id, submission_id, document_name, document_type, status, created_at, updated_at,case_category,category_confidence ,is_deleted) VALUES ('${file_id}', '${sumission_id}', '${file_original_name}', 'application/pdf', 'submitted', NOW(), NOW(),'${application_type}',0.8,false)`
        await runQuery(contextOltp, sqlQuery)
        sqlCaseId = `SELECT case_no::INTEGER,submission_id
        FROM virgin_island.documents where file_id='${file_id}'`
        let sqlCaseIdResult =  await runQuery(contextOltp, sqlCaseId)
        let obj = { success: true ,submission_id:sqlCaseIdResult[0]?.submission_id,case_id:sqlCaseIdResult[0]?.case_no}
        return apiResponse(res, 201, obj)

    } catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error, 500)
    }
}

const uploadIncome = async (req, res) => {
    try {
        let files = req.files
        let user_id = req?.body?.user_id
        let category_type = req?.body?.category_type
        let file_id = req?.body?.file_id
        let case_no = req?.body?.case_no
        let error_message
        console.log(req?.body, '<== body')
        if (!user_id) {
            return successFalse(res, 'user_id is required', 500)
        }
        if (!files?.length) {
            return successFalse(res, 'no files to upload', 500)
        }
        let uploadPromises = []
        let qualityPromises = []
        files?.forEach(file => {
            const file_id = uuidv4()
            uploadPromises.push(uploadFileToStorage(file?.path, file?.originalname, file_id, storage))
            qualityPromises.push(checkDocumentQuality(file?.path))
        })
        let pdf = await Promise.allSettled(uploadPromises)
        let quality = await Promise.allSettled(qualityPromises)
        quality?.map((doc_quality, index) => {

            if (doc_quality?.value?.confidence < 0.7) {
                // files?.forEach(file => {
                //     try {
                //         fs.unlinkSync(file?.path)
                //     } catch (error) {
                //         console.log(error)
                //     }
                // })
                error_message = `${files?.[index]?.originalname} document quality is poor; the Document is ${doc_quality?.value?.reason}. You may continue or upload a higher quality document.`
                // let obj = { success: true, inCorrectMessage: `${files?.[index]?.originalname} Document Quality is Poor` }
                // return apiResponse(res, 200, obj)
            }
        })
        let categoriesPromises = []
        files = files?.map((file, index) => {

            file.fileId = pdf[index]?.value?.file_id
            file.fileUrl = pdf[index]?.value?.fileUrl
            categoriesPromises.push(categoryClassify(file.fileUrl))
            file.fileType = 'form'
            file.originalFileUrl = file.fileUrl
            return file
        })


        let filesDataIncome = {
            folder_id: "1c956e27-cc31-40c9-8273-b2bd3cf2ee75",
            is_custom: true,
            processorId: "cf3d997d72d9ac64",
            project_id: "b861f9c4-4d06-4640-9913-16ae035c7814",
            project_name: "VIRGIN_ICOME_PARSER",
            retension: 100,
            table_name: "VIRGIN_ICOME_PARSER_b861f9c4_4d06_4640_9913_16ae035c7814.Virgin_Income_Parser_55a17c32_ff8f_4c0f_a11c_4bea795c50cb",
            template_file_name: "55a17c32-ff8f-4c0f-a11c-4bea795c50cb-null",
            template_id: "55a17c32-ff8f-4c0f-a11c-4bea795c50cb",
            user_email: "myasirkhan575@gmail.com",
            user_id: "6911e06f-7e44-4d43-adb0-75b595ebfe2c",
        }
        let filesDataExpense = {
            folder_id: "ef68b9c7-ca23-4910-bfbd-08ce79a89785",
            is_custom: true,
            processorId: "6edcaf39cbe55269",
            project_id: "6b414e07-320a-44c7-bda8-b81dbc27f7b6",
            project_name: "VIRGIN_EXPENSE_PARSE",
            retension: 100,
            table_name: "VIRGIN_EXPENSE_PARSE_6b414e07_320a_44c7_bda8_b81dbc27f7b6.Virgin_expense_parser_ea4c3650_3306_42aa_b216_46d4907fdc6f",
            template_file_name: "ea4c3650-3306-42aa-b216-46d4907fdc6f-null",
            template_id: "ea4c3650-3306-42aa-b216-46d4907fdc6f",
            user_email: "myasirkhan575@gmail.com",
            user_id: "6911e06f-7e44-4d43-adb0-75b595ebfe2c",
        }
        if (category_type == 'income') {
            filesDataIncome.files = files
        }
        else {
            filesDataExpense.files = files
        }
        let url = 'https://artifact-api-2my7afm7yq-ue.a.run.app/api/artifact/'
        let result = await axios.post(url, category_type && category_type == 'income' ? filesDataIncome : filesDataExpense)
        let insertPromises = []
        if (result?.data?.success) {
            result?.data?.artifactIds?.map((artifactId, index) => {
                let sqlQuery = `INSERT INTO virgin_island.case_docs(artifact_id,file_id,case_no, document_name, document_type,category_type, status, created_at, updated_at ,is_deleted) VALUES ('${artifactId}', '${file_id}', '${case_no}','${files?.[index]?.originalname}', '${files?.[index]?.mimetype}','${category_type}', 'submitted', NOW(), NOW(),false)`
                insertPromises.push(runQuery(contextOltp, sqlQuery))
            })
            await Promise.allSettled(insertPromises)
        }
        console.log(result, '<== result')
        
        files?.forEach(file => {
                try {
                    fs.unlinkSync(file?.path)
                } catch (error) {
                    console.log(error)
                }
            })
        let obj = {
            success: true,
            artifactIds: result?.data?.artifactIds,
            errData: result?.data?.errData,
            inCorrectMessage:error_message
        }
        return apiResponse(res, 201, obj)
    }
    catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error, 500)
    }

}

const uploadIdentity = async (req, res) => {
    try {
        let files = req.files
        let user_id = req?.body?.user_id
        let category_type = req?.body?.category_type
        let error_message
        let file_id = req?.body?.file_id
        let case_no = req?.body?.case_no
        console.log(req?.body, '<== body')
        if (!files?.length) {
            return successFalse(res, 'no files to upload', 500)
        }

        let uploadPromises = []
        let qualityPromises = []
        files?.forEach(file => {
            const file_id = uuidv4()
            uploadPromises.push(uploadFileToStorage(file?.path, file?.originalname, file_id, storage))
            qualityPromises.push(checkDocumentQuality(file?.path))
        });
        let pdf = await Promise.allSettled(uploadPromises)
        let quality = await Promise.allSettled(qualityPromises)
        quality?.map((doc_quality, index) => {

            if (doc_quality?.value?.confidence < 0.7) {
                // files?.forEach(file => {
                //     try {
                //         fs.unlinkSync(file?.path)
                //     } catch (error) {
                //         console.log(error)
                //     }
                // })
                error_message = `${files?.[index]?.originalname} document quality is poor; the Document is ${doc_quality?.value?.reason}. You may continue or upload a higher quality document.`
                // let obj = { success: true, inCorrectMessage: `${files?.[index]?.originalname} Document Quality is Poor` }
                // return apiResponse(res, 200, obj)
            }
        })

        let categoriesPromises = []
        files = files?.map((file, index) => {

            file.fileId = pdf[index]?.value?.file_id
            file.fileUrl = pdf[index]?.value?.fileUrl
            categoriesPromises.push(categoryClassify(file.fileUrl))
            file.fileType = 'form'
            file.originalFileUrl = file.fileUrl
            return file
        })



        let filesData = {
            folder_id: "4429c97b-aaca-4c0e-9113-c49b43ae06a3",
            is_custom: true,
            processorId: "da075de76b13d14",
            project_id: "36eb0fcf-b46a-47c7-ba42-5ee70a9e27f1",
            project_name: "Virgin_Identity_proj",
            retension: 100,
            table_name: "Virgin_Identity_proj_36eb0fcf_b46a_47c7_ba42_5ee70a9e27f1.Virgin_island_Identity_97ad1c29_066d_41a3_9aa7_831705d7f670",
            template_file_name: "97ad1c29-066d-41a3-9aa7-831705d7f670-null",
            template_id: "97ad1c29-066d-41a3-9aa7-831705d7f670",
            user_email: "sfakher27@gmail.com",
            user_id: "e7a12839-816e-474a-8e47-782183a2961b",
        }

        filesData.files = files

        let url = 'https://artifact-api-2my7afm7yq-ue.a.run.app/api/artifact/'
        let result = await axios.post(url, filesData)
        let insertPromises = []
        if (result?.data?.success) {
            result?.data?.artifactIds?.map((artifactId, index) => {
                let sqlQuery = `INSERT INTO virgin_island.case_docs(artifact_id,file_id,case_no, document_name, document_type,category_type, status, created_at, updated_at ,is_deleted) VALUES ('${artifactId}', '${file_id}', '${case_no}','${files?.[index]?.originalname}', '${files?.[index]?.mimetype}','identity', 'submitted', NOW(), NOW(),false)`
                insertPromises.push(runQuery(contextOltp, sqlQuery))
            })
            await Promise.allSettled(insertPromises)
        }
        console.log(result, '<== result')
        files?.forEach(file => {
            try {
                fs.unlinkSync(file?.path)
            } catch (error) {
                console.log(error)
            }
        })
        let obj = {
            success: true,
            artifactIds: result?.data?.artifactIds,
            errData: result?.data?.errData,
            inCorrectMessage:error_message
        }
        return apiResponse(res, 201, obj)
    }
    catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error, 500)
    }

}
const uploadSupportingDocs = async (req, res) => {
    try {
        let file = req.file
        const { user_id, file_id, supp_doc_type } = req?.body
        console.log(req?.body, '<== body')
        console.log(req?.file, '<== File')
        if (!user_id || !file_id || !supp_doc_type) {
            return successFalse(res, 'Please Provide all Fields', 500)
        }
        if (!file) {
            return successFalse(res, 'no files to upload', 500)
        }
        const file_ID = uuidv4()
        let { fileUrl } = await uploadFileToStorage(file?.path, file?.originalname, file_ID, storage)
        const id = uuidv4()
        let file_name = file?.originalname
        let suppDocInsert = `INSERT INTO virgin_island.supporting_docs(id, user_id, file_id,supp_doc_type,file_address,file_name, created_at)VALUES ('${id}', '${user_id}','${file_id}', '${supp_doc_type}','${fileUrl}','${file_name}', NOW())`
        await runQuery(contextOltp, suppDocInsert)
        let obj = {
            success: true,
        }
        return apiResponse(res, 201, obj)
    }
    catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error, 500)
    }

}


let minutes = process.env.NODE_ENV === 'production' ? 15 : 60

const secretOrKey = process.env.SECRET
// const secretKey = 'access_token'
const secretKey = process.env?.secretKey

const login = (req, res) => {
    try {
        const { email, password } = req.body

        let sqlQuery = `SELECT user_id,password, name, email, auth_type, role, is_deleted, created_at, updated_at, last_login, curr_login FROM virgin_island.users WHERE email='${email}' AND auth_type='web' and is_deleted is not true`

        // Run the query
        runQuery(contextOltp, sqlQuery)
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

                    const userRow = await runQuery(contextOltp, sqlQuery)
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
const registerSecret = 'verify'

const updateIsOpen = async (req, res) => {
    try {
        const { value, file_id } = req?.body
        let sqlQuery = `update virgin_island.documents set is_open=${value} where file_id='${file_id}'`
        await runQuery(contextOltp, sqlQuery)
        let obj = {
            success: true
        }
        return apiResponse(res, 201, obj)
    } catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error?.message)
    }
}
const getCaseDetails = async (req, res) => {
    try {
        let { adju_status, case_status, page, rowsPerPage, case_category, user_id, search } = req?.body
        rowsPerPage = rowsPerPage || 5
        page = page || 0
        let offset = (page) * rowsPerPage

        let adju_condition = ``
        let case_condition = ``
        let category_condition = ``
        let search_condition = ``
        if (adju_status) {
            adju_condition = `and doc.adjudicate_status = '${adju_status}'`
        }
        if (case_status) {
            case_condition = `and doc.case_status = '${case_status}'`
        }
        if (case_category) {
            category_condition = `and doc.case_category = '${case_category}'`
        }
        if (search) {
            search = search.toLowerCase()
            search_condition = `and lower(doc.case_no) like '%${search}%'`
        }

        let sqlQuery = `with case_details as (SELECT doc.file_id,doc.case_category,concat('case-',doc.case_no)::char varying case_no,TO_CHAR(doc.created_at,'Mon dd, yyyy hh12:mi AM') created_at,doc.priority,doc.case_status	FROM virgin_island.documents doc left join virgin_island.submissions sub on sub.submission_id=doc.submission_id where  doc.is_deleted is not true ${adju_condition}  ${case_condition}  ${category_condition} order by doc.created_at desc)
        select doc.file_id,doc.case_category,doc.case_no,doc.created_at,doc.priority,doc.case_status from case_details doc where 1=1 ${search_condition} limit ${rowsPerPage} offset ${offset}`

        let result = await runQuery(contextOltp, sqlQuery)
        let countQuery = `
        with case_details as ( select doc.adjudicate_status,doc.case_status,doc.case_category,doc.is_deleted,concat('case-',doc.case_no)::char varying case_no	FROM virgin_island.documents doc)
        SELECT count(doc.*) FROM case_details doc where  doc.is_deleted is not true ${adju_condition}  ${case_condition}  ${category_condition} ${search_condition}`
        let total_records = await runQuery(contextOltp, countQuery)
        let obj = {
            success: true,
            data: result,
            total_records: total_records[0]?.count
        }
        return apiResponse(res, 200, obj)
    } catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error?.message)
    }
}

const updateLoginTime = async (req, res) => {
    try {
        const { user_id } = req?.body
        let sqlQuery = `update virgin_island.users set last_login=curr_login where user_id='${user_id}'`
        await runQuery(contextOltp, sqlQuery)
        let sqlQueryCurrentLogin = `update virgin_island.users set curr_login=NOW() where user_id='${user_id}'`
        await runQuery(contextOltp, sqlQueryCurrentLogin)
        let obj = {
            success: true
        }
        return apiResponse(res, 201, obj)
    } catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error?.message)
    }
}
const updateCaseNotes = async (req, res) => {
    try {
        const { file_id, notes } = req?.body
        let sqlQuery = `update virgin_island.documents set notes='${notes}' where file_id='${file_id}'`
        await runQuery(contextOltp, sqlQuery)
        let obj = {
            success: true
        }
        return apiResponse(res, 201, obj)
    } catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error?.message)
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
        runQuery(contextOltp, sqlQuery)
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
                    runQuery(contextOltp, sqlQuery)
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

const updateCasePriority = async (req, res) => {
    try {
        const { key_name, key_vale, file_id } = req?.body
        let sqlQuery = `update virgin_island.documents set ${key_name}='${key_vale}' where file_id='${file_id}'`
        await runQuery(contextOltp, sqlQuery)
        let obj = {
            success: true
        }
        return apiResponse(res, 201, obj)
    }
    catch (error) {
        console.log(error, '<== error')
        return successFalse(res, error?.message)
    }
}

const getDocumentByAdjudication = async (req, res) => {
    try {
        let { user_id, case_status, case_category, search } = req?.body
        let case_condition = ''
        let category_condition = ''
        let search_condition = ''

        if (case_status) {
            case_condition = `and doc.case_status = '${case_status}'`
        }
        if (case_category) {
            category_condition = `and doc.case_category = '${case_category}'`
        }
        if (search) {
            search = search.toLowerCase()
            search_condition = `and concat('case-',doc.case_no) like '%${search}%'`
        }

        let sqlQuery = `with docGrouping as (select (count(doc.adjudicate_status) filter (where doc.adjudicate_status = 'Requires Review' ${case_condition} ${category_condition} ${search_condition}))::INTEGER require_review_cases,
        (count(doc.adjudicate_status) filter (where doc.adjudicate_status = 'Rejected' ${case_condition} ${category_condition} ${search_condition}))::INTEGER rejected_cases,
        (count(doc.adjudicate_status) filter (where doc.adjudicate_status = 'Completed' ${case_condition} ${category_condition} ${search_condition}))::INTEGER completed_count
        from virgin_island.documents doc left join virgin_island.submissions sub on 
        sub.submission_id=doc.submission_id group by user_id)
        SELECT SUM(require_review_cases)::INTEGER as require_review_cases,
        SUM(rejected_cases)::INTEGER as rejected_cases,
        SUM(completed_count)::INTEGER as completed_count  FROM docGrouping`
        let result = await runQuery(contextOltp, sqlQuery)
        let obj = {
            success: true,
            data: result[0]
        }

        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }
}

const getCasesByCaseStatus = async (req, res) => {
    try {
        let { user_id, adju_status, case_category, search } = req?.body
        let adju_condition = ''
        let category_condition = ''
        let search_condition = ''
        if (adju_status) {
            adju_condition = `and doc.adjudicate_status = '${adju_status}'`
        }
        if (case_category) {
            category_condition = `and doc.case_category = '${case_category}'`
        }
        if (search) {
            search = search.toLowerCase()
            search_condition = `and concat('case-',doc.case_no) like '%${search}%'`
        }

        let sqlQuery = `with caseStatusGrouping as (select (count(doc.case_status) filter (where doc.case_status = 'New' ${adju_condition} ${category_condition} ${search_condition}))::INTEGER new_cases,
        (count(doc.case_status) filter (where doc.case_status = 'Assigned' ${adju_condition} ${category_condition} ${search_condition}))::INTEGER assigned_cases,
        (count(doc.case_status) filter (where doc.case_status = 'Pending Action' ${adju_condition} ${category_condition} ${search_condition}))::INTEGER pending_cases,
		(count(doc.case_status) filter (where doc.case_status = 'Awaiting Information' ${adju_condition} ${category_condition} ${search_condition}))::INTEGER awaiting_cases,
		(count(doc.case_status) filter (where doc.case_status = 'Approved' ${adju_condition} ${category_condition} ${search_condition}))::INTEGER approved_cases
        from virgin_island.documents doc left join virgin_island.submissions sub on
        sub.submission_id=doc.submission_id  group by user_id)
        SELECT SUM(new_cases)::INTEGER as new_cases,
        SUM(assigned_cases)::INTEGER as assigned_cases,
        SUM(awaiting_cases)::INTEGER as awaiting_cases,
        SUM(approved_cases)::INTEGER as approved_cases,
        SUM(pending_cases)::INTEGER as pending_cases  FROM caseStatusGrouping`
        let result = await runQuery(contextOltp, sqlQuery)
        let obj = {
            success: true,
            data: result[0]
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }
}

const getCasesByCategory = async (req, res) => {
    try {
        let { user_id, adju_status, case_status, search } = req?.body

        let adju_condition = ''
        let case_condition = ''
        let search_condition = ''
        if (adju_status) {
            adju_condition = `and doc.adjudicate_status = '${adju_status}'`
        }
        if (case_status) {
            case_condition = `and doc.case_status = '${case_status}'`
        }
        if (search) {
            search = search.toLowerCase()
            search_condition = `and concat('case-',doc.case_no) like '%${search}%'`
        }


        let sqlQuery = `with caseCategory as ( select (count(doc.case_category) filter (where doc.case_category = 'MAP Application' ${adju_condition} ${case_condition} ${search_condition}))::INTEGER map_type,
        (count(doc.case_category) filter (where doc.case_category = 'SNAP Application' ${adju_condition} ${case_condition} ${search_condition}))::INTEGER snap_type,
		(count(doc.case_category) filter (where doc.case_category = 'TANF Application' ${adju_condition} ${case_condition} ${search_condition}))::INTEGER tanf_type
        from virgin_island.documents doc left join virgin_island.submissions sub on
        sub.submission_id=doc.submission_id group by user_id)
        SELECT SUM(map_type)::INTEGER as map_type,
        SUM(snap_type)::INTEGER as snap_type,
        SUM(tanf_type)::INTEGER as tanf_type  FROM caseCategory`
        let result = await runQuery(contextOltp, sqlQuery)
        let obj = {
            success: true,
            data: result[0]
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }
}

const feedback = async (req, res) => {
    try {
        let { feedback, user_id, rating, file_id } = req?.body

        let document_request = {
            content: feedback,
            type: 'PLAIN_TEXT',
        }
        feedback = feedback.replace(/'/g, "''")
        const sentiment_result = await languageClient.analyzeSentiment({ document: document_request })
        const document_score = sentiment_result[0]?.documentSentiment?.score || 0
        const documentMagnitude = sentiment_result[0]?.documentSentiment?.magnitude
        let sql = `INSERT INTO virgin_island.feedbacks(
            id, feedback, user_id, rating, created_at,sentiment)
            VALUES ('${file_id}','${feedback}','${user_id}','${rating}', NOW(),${document_score})`
        await runQuery(contextOltp, sql)

        let obj = {
            success: true
        }
        return apiResponse(res, 200, obj)

    } catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }
}
const addNotes = async (req, res) => {
    try {
        let { notes, user_id, file_id } = req?.body
        let id = uuidv4()
        let sql = `INSERT INTO virgin_island.notes(id, case_id, user_id, notes_text, created_at) VALUES ('${id}', '${file_id}', '${user_id}', '${notes}', NOW())`
        await runQuery(contextOltp, sql)

        let obj = {
            success: true
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }
}

module.exports = {
    upload,
    login,
    register,
    updateCasePriority,
    updateIsOpen,
    updateLoginTime,
    getCaseDetails,
    getDocumentByAdjudication,
    getCasesByCaseStatus,
    getCasesByCategory,
    uploadSupportingDocs,
    uploadIncome,
    updateCaseNotes,
    uploadIdentity,
    uploadApplication,
    submitApplication,
    feedback,
    addNotes
}