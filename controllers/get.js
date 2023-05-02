
const { v4: uuidv4 } = require('uuid')
const _ = require('lodash')
const { downloadFile, getDate } = require('../helpers')
const axios = require('axios')
const { runQuery, validateData, imageTextDetection, isNull, apiResponse, successFalse, arrayIntoPostgresqlArray, getAuthUrl } = require('virgin-helpers')
const { contextOltp, service_key, languageClient, storage } = require('../config')
const { all } = require('../routes')

const getDocumentsBySubmissionId = async (req, res) => {
    try {
        const submission_id = req?.query?.submission_id
        let sqlQuery = `SELECT file_id, submission_id, document_name, document_type, status, created_at FROM virgin_island.documents where submission_id='${submission_id}' and is_deleted is not true`
        let result = await runQuery(contextOltp, sqlQuery)
        let obj = {
            success: true,
            data: result
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }

}

const searchApplicant = async (req, res) => {
    try {
        let search = req?.body?.search
        let page = req?.body?.page || 0
        search = search.toLowerCase()
        search = search.replace(/'/g, "''")
        let offset = page * 10
        let sql = `select kp.field_value,kp.field_name,doc.document_name,doc.file_id,concat('case-',doc.case_no) case_id from context.schema_form_key_pairs kp inner join virgin_island.documents doc on kp.file_name=concat('form-',doc.file_id,'-',doc.document_name) where (lower(doc.document_name) like '%${search}%') or (lower(kp.field_value) like '%${search}%') limit 10 offset ${offset}`
        let sql2 = `select kp.field_value,kp.field_name,cd.document_name,cd.file_id,concat('case-',doc.case_no) case_id from context.schema_form_key_pairs kp 
        inner join virgin_island.case_docs cd on kp.file_name=concat('form-',cd.artifact_id,'-',cd.document_name) left join virgin_island.documents doc on doc.file_id=cd.file_id
        where (lower(cd.document_name) like '%${search}%') or (lower(kp.field_value) like '%${search}%') limit 10 offset ${offset}`
        let result = await runQuery(contextOltp, sql)
        let result2 = await runQuery(contextOltp, sql2)
        let sqlCount = `select count(doc.file_id)::INTEGER from context.schema_form_key_pairs kp inner join virgin_island.documents doc on kp.file_name=concat('form-',doc.file_id,'-',doc.document_name) where (lower(doc.document_name) like '%${search}%') or (lower(kp.field_value) like '%${search}%')`
        let recordsCount = await runQuery(contextOltp, sqlCount)

        let obj = { success: true, data: [...result, ...result2], total_records: recordsCount[0]?.count }
        return apiResponse(res, 200, obj)
    } catch (error) {
        console.log(error)
        let obj = { success: false, message: error }
        return apiResponse(res, 500, obj)
    }
}

const searchWithinApplicant = async (req, res) => {
    try {
        let search = req?.body?.search
        let file_id = req?.body?.file_id
        if (!file_id) {
            return successFalse(res, 'file_id is required!')
        }
        let page = req?.body?.page || 0
        search = search.toLowerCase()
        search = search.replace(/'/g, "''")
        let sql = ` with applicant_table as (select array_agg(jsonb_build_object('field_name',kp.field_name,'field_value',kp.field_value)) key_pairs,'applicant_form' as applicant_form,doc.document_name,doc.file_id from context.schema_form_key_pairs kp
        left join virgin_island.documents doc on kp.file_name = concat('form-',doc.file_id,'-',doc.document_name) 
        where doc.file_id='${file_id}' and ((lower(doc.document_name) like '%${search}%') or
        (lower(kp.field_value) like '%${search}%')  or
        (lower(kp.field_value) like '%${search}%')) group by applicant_form,doc.document_name,doc.file_id),
        supporting_doc as (select array_agg(jsonb_build_object('field_name',kp.field_name,'field_value',kp.field_value)) key_pairs,cd.category_type as applicant_form,cd.document_name,cd.artifact_id from context.schema_form_key_pairs kp
        left join virgin_island.case_docs cd on kp.file_name = concat('form-',cd.artifact_id,'-',cd.document_name)
        left join virgin_island.documents doc on doc.file_id = cd.file_id
        where doc.file_id='${file_id}' and ((lower(cd.document_name) like '%${search}%') or
        (lower(kp.field_value) like '%${search}%')  or
        (lower(kp.field_name) like '%${search}%')) group by applicant_form,cd.document_name,cd.artifact_id)
        select applicant_form,document_name,file_id,jsonb_build_object('artifact_data',a.*) artifact_data,key_pairs from applicant_table app_t left join public.artifacts a on a.id=app_t.file_id
        union
        select applicant_form,document_name,artifact_id,jsonb_build_object('artifact_data',a.*) artifact_data,key_pairs from supporting_doc sd left join public.artifacts a on a.id=sd.artifact_id`
        let result = await runQuery(contextOltp, sql)
        let applicant_form = []
        let applicant_identity = []
        let applicant_income = []
        let applicant_expenses = []
        result.map(resu => {
            if (resu?.applicant_form == 'applicant_form') { 
                let data = {document_name:resu?.document_name,...resu?.artifact_data,key_pairs:resu?.key_pairs}
                applicant_form.push(data)
            }
            if (resu?.applicant_form == 'identity') { 
                let data = {document_name:resu?.document_name,...resu?.artifact_data,key_pairs:resu?.key_pairs}
                applicant_identity.push(data)
            }
            if (resu?.applicant_form == 'income') { 
                let data = {document_name:resu?.document_name,...resu?.artifact_data,key_pairs:resu?.key_pairs}
                applicant_income.push(data)
            }
            if (resu?.applicant_form == 'expense') { 
                let data = {document_name:resu?.document_name,...resu?.artifact_data,key_pairs:resu?.key_pairs}
                applicant_expenses.push(data)
            }

        })

        let obj = { success: true, data: {applicant_form,applicant_identity,applicant_income,applicant_expenses} }
        return apiResponse(res, 200, obj)
    } catch (error) {
        console.log(error)
        let obj = { success: false, message: error }
        return apiResponse(res, 500, obj)
    }
}

const getCasesDetailByDocId = async (req, res) => {
    try {
        const document_id = req?.query?.document_id
        let sqlQuery = `with case_detail_modified as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
        document_name, document_type, status,case_status,adjudicate_status, created_at, updated_at, is_deleted FROM virgin_island.documents where file_id='${document_id}')
        select kp.field_name,kp.field_value from context.schema_form_key_pairs kp inner join case_detail_modified doc on doc.file_name = kp.file_name
        where (kp.field_name like 'APPLICANT%') or (kp.field_name like '%CASE NAME%') or (kp.field_name like '%HOME ADDRESS%') or (kp.field_name like '%SSN%') or (kp.field_name like '%MOBILE%') or (kp.field_name like '%Cell%') or (kp.field_name like '%BIRTH DATE:%')`
        let sqlCase = ` with case_table as (select concat('case-',doc.case_no) case_no,unnest(cd.members) member_list,doc.document_name
        from virgin_island.documents doc inner join  virgin_island.case_details cd on cd.file_id = doc.file_id
                where doc.file_id='${document_id}'),
                doc_table as (select ct.case_no,concat('form-',ct.member_list,'-',doc.document_name) file_name from case_table ct left join virgin_island.documents doc on doc.file_id = ct.member_list)
	   select array_agg(kp.field_value) members,dt.case_no from context.schema_form_key_pairs kp inner join doc_table dt on dt.file_name = kp.file_name where kp.field_name like 'APPLICANT%' group by dt.case_no`
        let case_summary = {}
        let queryResult = await runQuery(contextOltp, sqlQuery)
        let docResult = await runQuery(contextOltp, sqlCase)
        queryResult?.map(d => {
            if (d?.field_name?.includes('MOBILE PHONE') || d?.field_name?.includes('Cell')) {
                case_summary.mobile = d?.field_value?.replace(/\(|\)/g, '')
            }
            else if (d?.field_name?.includes('HOME ADDRESS')) {
                case_summary.address = d?.field_value
            }
            else if (d?.field_name?.includes('APPLICANT') || d?.field_name?.includes('CASE NAME')) {
                case_summary.name = d?.field_value
            }
            else if (d?.field_name?.includes('BIRTH DATE')) {
                case_summary.dob = d?.field_value
            }
            else if (d?.field_name?.includes('SSN')) {
                let ssn = d?.field_value
                ssn = '***-**-' + ssn?.slice(ssn.length - 4, ssn.length)
                case_summary.ssn = ssn
            }
        })
        case_summary.case_no = docResult[0]?.case_no
        case_summary.members = docResult[0]?.members
        let obj = {
            success: true,
            data: case_summary
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }

}

const getDashboardCaseCount = async (req, res) => {
    try {
        const user_id = req?.query?.user_id
        let sqlQuery = `with caseGrouping as (select  (count(doc.priority) filter (where doc.priority = 'High'))::INTEGER high_priority_count,
        (count(doc.adjudicate_status) filter (where doc.adjudicate_status <> 'Completed'))::INTEGER open_cases_count,
        (count(doc.case_status) filter (where doc.case_status = 'Awaiting Information'))::INTEGER await_info_count,
        (count(doc.case_status) filter (where doc.case_status = 'New'))::INTEGER new_case_count
        from virgin_island.documents doc left join virgin_island.submissions sub on 
        sub.submission_id=doc.submission_id group by user_id)
        SELECT SUM(high_priority_count)::INTEGER as high_priority_count,
        SUM(open_cases_count)::INTEGER as open_cases_count,
        SUM(await_info_count)::INTEGER as await_info_count,
		SUM(new_case_count)::INTEGER as new_case_count
		FROM caseGrouping`
        // let sqlQuery = `select (count(doc.priority) filter (where doc.priority = 'High'))::INTEGER high_priority_count,
        // (count(doc.adjudicate_status) filter (where doc.adjudicate_status <> 'Completed'))::INTEGER open_cases_count,
        // (count(doc.case_status) filter (where doc.case_status = 'Awaiting Information'))::INTEGER await_info_count
        // from virgin_island.documents doc left join virgin_island.submissions sub on 
        // sub.submission_id=doc.submission_id group by user_id`
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

const getAdjudicateStatus = async (req, res) => {
    try {
        const file_id = req?.query?.file_id
        let sqlQuery = `select adjudicate_status from virgin_island.documents where file_id='${file_id}'`
        let result = await runQuery(contextOltp, sqlQuery)
        let obj = {
            success: true,
            data: result[0].adjudicate_status
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }
}
const getSupportingDocsIncome = async (req, res) => {
    try {
        const file_id = req?.query?.file_id
        let sqlQuery = `select * from virgin_island.supporting_docs where file_id='${file_id}' AND supp_doc_type='income' ORDER BY created_at DESC LIMIT 5`
        let result = await runQuery(contextOltp, sqlQuery)
        let getURL = []
        result.map((v, i) => {
            getURL?.push(getAuthUrl(v?.file_address, storage))
        })
        let finalData = await Promise.allSettled(getURL)
        finalData?.map((v, i) => {
            result[i].file_address = v?.value
        })
        let obj = {
            success: true,
            data: result
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }
}
const getSupportingDocsExpense = async (req, res) => {
    try {
        const file_id = req?.query?.file_id
        let sqlQuery = `select * from virgin_island.supporting_docs where file_id='${file_id}' AND supp_doc_type='expense' ORDER BY created_at DESC LIMIT 5`
        let result = await runQuery(contextOltp, sqlQuery)
        let getURL = []
        result.map((v, i) => {
            getURL?.push(getAuthUrl(v?.file_address, storage))
        })
        let finalData = await Promise.allSettled(getURL)
        finalData?.map((v, i) => {
            result[i].file_address = v?.value
        })
        let obj = {
            success: true,
            data: result
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }
}

const getAllSubmissions = async (req, res) => {
    try {
        let { searchValue, page, rowsPerPage, user_id, user_role } = req?.body
        rowsPerPage = rowsPerPage || 10
        // page = page || 1
        let offset = (page) * rowsPerPage
        let conditions = searchValue ? `${user_role == 'manager' ? '' : `and sub.user_id='${user_id}'`} and (sub.submission_id like '${'%' + searchValue + '%'}' or (sub.documents)::text like '%${searchValue}%')` : `${user_role == 'manager' ? '' : `and sub.user_id='${user_id}'`}`

        let sqlQuery = `SELECT  submission_id,TO_CHAR(created_at,'Mon dd, yyyy hh12:mi AM') created_at, array_length(documents, 1) as documents, flow, tasks, status, TO_CHAR(completed_date,'Mon dd, yyyy hh12:mi AM') completed_date,case_status,priority FROM virgin_island.submissions sub where 1=1 and is_deleted is not true ${conditions} order by created_at desc  limit ${rowsPerPage} offset ${offset} `
        let result = await runQuery(contextOltp, sqlQuery)
        let totalCount = `SELECT count(submission_id)::integer FROM virgin_island.submissions sub where 1=1 and is_deleted is not true ${conditions}`
        let count = await runQuery(contextOltp, totalCount)
        let obj = {
            success: true,
            data: result,
            totalRecords: count[0]?.count
        }
        return apiResponse(res, 200, obj)
    }
    catch (error) {
        console.log(error)
        return successFalse(res, error, 500)
    }

}
// const getAllDocuments = async (req, res) => {
//     try {
//         let { searchValue, page, rowsPerPage,user_id } = req?.body
//         rowsPerPage = rowsPerPage || 10
//         page = page || 1
//         let offset = (page - 1) * rowsPerPage
//         if(!user_id)
//         {
//             return successFalse(res,'user_id is required!',500)
//         }
//         let conditions = searchValue ? `and sub.user_id='${user_id}' and ((sub.submission_id = '${searchValue}' or lower(doc.document_name) like lower('${'%' + searchValue + '%'}')) and sub.submission_id is not null)` : `and sub.user_id='${user_id}'`
//         let sqlQuery = `SELECT sub.submission_id,doc.document_name,doc.document_type,doc.status FROM virgin_island.documents doc left join virgin_island.submissions sub on sub.submission_id=doc.submission_id where 1=1 and doc.is_deleted is not true ${conditions} limit ${rowsPerPage} offset ${offset}`
//         let result = await runQuery(contextOltp, sqlQuery)
//         let totalCount = `SELECT count(doc.document_name)::INTEGER FROM virgin_island.documents doc left join virgin_island.submissions sub on sub.submission_id=doc.submission_id where 1=1 and doc.is_deleted is not true ${conditions}`
//         let count = await runQuery(contextOltp, totalCount)

//         let obj = {
//             success: true,
//             data: result,
//             totalRecords: count[0]?.count
//         }
//         return apiResponse(res, 200, obj)
//     }
//     catch (error) {
//         console.log(error)
//         return successFalse(res, error, 500)
//     }

// }
const getAllDocuments = async (req, res) => {

    try {
        let { key, project_id, search, folders, limit, processing, submission_id, searchValue, page, rowsPerPage, user_id, user_role } = req.body
        let userSharedArtifacts = []
        // let selectQuery = `SELECT submission_id,array_agg(file_id) artifact_ids FROM virgin_island.documents where submission_id='${submission_id}' group by submission_id`

        rowsPerPage = rowsPerPage || 10
        limit = rowsPerPage
        // page = page || 1
        let offset = (page) * rowsPerPage
        if (!user_id) {
            console.log(req?.body, '<== body')
            return successFalse(res, 'user_id is required!', 500)
        }

        let conditions = searchValue ? `${user_role == 'collaborator' ? '' : `and sub.user_id='${user_id}'`} and ((sub.submission_id = '${searchValue}' or lower(doc.document_name) like lower('${'%' + searchValue + '%'}')) and sub.submission_id is not null)` : `${user_role == 'collaborator' ? '' : `and sub.user_id='${user_id}'`}`

        let sqlQuery2 = `SELECT a.*,sub.submission_id,doc.file_id,doc.document_name,doc.document_type,doc.status FROM virgin_island.documents doc left join virgin_island.submissions sub on sub.submission_id=doc.submission_id left join public.artifacts a on a.id=doc.file_id where doc.is_deleted is not true ${conditions} limit ${rowsPerPage} offset ${offset}`

        let result2 = await runQuery(contextOltp, sqlQuery2)
        let totalCount = `SELECT count(doc.document_name)::INTEGER FROM virgin_island.documents doc left join virgin_island.submissions sub on sub.submission_id=doc.submission_id where 1=1 and doc.is_deleted is not true ${conditions}`
        let count = await runQuery(contextOltp, totalCount)

        //         let count = await runQuery(contextOltp, totalCount)
        // let selectQuery = `SELECT sub.user_id,array_agg(doc.file_id) artifact_ids FROM virgin_island.documents doc left join virgin_island.submissions sub on sub.submission_id=doc.submission_id where 1=1 ${conditions} group by sub.user_id `
        // let artifactList = await runQuery(contextOltp, selectQuery)
        // let artifactList = await runQuery(contextOltp, selectQuery)
        // project_id = 'd16547d4-6d32-46e8-baf8-360a746005da'

        // let filesLimit = limit && isNumber(Number(limit)) ? `LIMIT ${limit}` : ''

        // Run the query
        runQuery(contextOltp, sqlQuery2)
            .then(async (rows) => {
                if (rows.length > 0) {
                    let result
                    for (var i in rows) {
                        rows[i].file_address = await getAuthUrl(rows?.[i]?.file_address, storage)
                        if (rows[i]?.redacted_file_address) {
                            rows[i].redacted_file_address = await getAuthUrl(rows?.[i]?.redacted_file_address, storage)
                        }
                        rows[i].shared = false
                        console.log(result2[i], i, '<== result2')
                        rows[i].document_name = result2[i].document_name
                        rows[i].submission_id = result2[i].submission_id
                        rows[i].document_type = result2[i].document_type
                        rows[i].status = result2[i].status

                        let originalFileAddress = rows?.[i]?.original_file_address
                        if (originalFileAddress) {
                            rows[i].original_file_address = await getAuthUrl(originalFileAddress, storage)
                        }

                        for (var j in rows[i].file_versions) {
                            rows[i].file_versions[j] = await getAuthUrl(rows[i]?.file_versions?.[j], storage)
                            rows[i].file_address = rows[i].file_versions[j]
                        }
                    }

                    if (userSharedArtifacts.length > 0) {
                        result = [...rows, ...userSharedArtifacts]
                    }
                    else {
                        result = rows
                    }

                    // result = _.unionBy(result, 'id')
                    let folders_name = _.unionBy(result, 'folder_name')?.map(v => v?.folder_name)

                    let obj = {
                        success: true,
                        data: result,
                        folders_name,
                        totalRecords: count[0]?.count,
                        project_id
                    }
                    console.log("Data found")
                    return apiResponse(res, 200, obj)
                }
                else {
                    let obj = {
                        success: true,
                        data: [],
                        totalRecords: 0
                    }
                    console.log("Data not found")
                    return apiResponse(res, 200, obj)
                }
            })
            .catch((e) => {
                console.log('error', e?.message)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('error', e?.message)
        return successFalse(res, e?.message)
    }
}

const getRecentDate = async (req, res) => {
    try {
        let user_id = req?.query?.user_id
        let sqlQuery = `select TO_CHAR(created_at, 'yyyy-mm-dd hh12:mi:ss AM') from virgin_island.submissions where user_id='${user_id}' order by created_at desc limit 1`
        let result = await runQuery(contextOltp, sqlQuery)
        let obj = { success: true, data: result[0] }
        return apiResponse(res, 200, obj)
    } catch (error) {
        console.log('error', error?.message)
        return successFalse(res, error?.message)
    }
}

const getAllApplicants = async (req, res) => {
    try {
        let user_id = req?.query?.user_id
        let user_role = req?.query?.user_role

        let rowsPerPage = req?.query?.rowsPerPage
        let page = req?.query?.page

        rowsPerPage = rowsPerPage ? rowsPerPage : 10
        page = page ? page : 0
        limit = rowsPerPage
        // page = page || 1
        let offset = (page) * rowsPerPage

        let sqlQuery
        if (user_role == 'applicant') {

            sqlQuery = ` with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
           document_name, document_type,case_no, status,case_status,adjudicate_status, created_at, updated_at, case_category,is_deleted FROM virgin_island.documents),
           key_pairs as (select * from context.schema_form_key_pairs)
           select kp.field_value as applicant_name,concat('case-',(array_agg(doc.case_no))[1]) case_id,(array_agg(doc.case_category))[1] case_type,count(doc.*)::INTEGER as total_submission,
           TO_CHAR(((array_agg(doc.created_at))[1]),'Mon dd, yyyy hh12:mi AM') last_date,
           count(doc.case_status) filter (where doc.case_status='Awaiting Information') 
           awaiting_applicant_info,count(doc.case_status) filter (where doc.case_status='Assigned') 
           assigned,count(doc.adjudicate_status) filter (where doc.adjudicate_status='Completed') 
           completed from document_table doc left join key_pairs kp on kp.file_name=doc.file_name 
           left join virgin_island.submissions sub on sub.submission_id=doc.submission_id left join virgin_island.users us on us.user_id=sub.user_id
           where (kp.field_name like 'APPLICANT:' or kp.field_name like '%CASE NAME:%') ${user_role == 'applicant' ? `and sub.user_id='${user_id}'` : ``}
           group by applicant_name limit ${limit} offset ${offset}`
        }
        else {
            sqlQuery = ` with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
            document_name, document_type,case_no, status,case_status,adjudicate_status, created_at, updated_at, case_category,is_deleted FROM virgin_island.documents),
            key_pairs as (select * from context.schema_form_key_pairs)
            select kp.field_value as applicant_name,concat('case-',(array_agg(doc.case_no))[1]) case_id,(array_agg(doc.case_category))[1] case_type,count(doc.*)::INTEGER as total_submission,
            TO_CHAR(((array_agg(doc.created_at))[1]),'Mon dd, yyyy hh12:mi AM') last_date,
            count(doc.case_status) filter (where doc.case_status='Awaiting Information') 
            awaiting_applicant_info,count(doc.case_status) filter (where doc.case_status='Assigned') 
            assigned,count(doc.adjudicate_status) filter (where doc.adjudicate_status='Completed') 
            completed from document_table doc left join key_pairs kp on kp.file_name=doc.file_name 
            left join virgin_island.submissions sub on sub.submission_id=doc.submission_id left join virgin_island.users us on us.user_id=sub.user_id
            where (kp.field_name = 'APPLICANT:' or kp.field_name like 'CASE NAME:')
            group by applicant_name limit ${limit} offset ${offset}`
        }

        let sqlQueryCount = `with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
        document_name, document_type, status,is_open, created_at, updated_at,adjudicate_status, is_deleted FROM virgin_island.documents),
        key_pairs as (select * from context.schema_form_key_pairs),
        final_table as (select kp.field_value,array_agg(doc.file_id),count(doc.file_name) filter (where doc.is_open is true)::INTEGER total_open,count(doc.file_name) filter
		(where doc.adjudicate_status = 'Requires Review')::INTEGER total_awaiting,count(doc.file_name) filter (where ( NOW() - doc.created_at) < '1 day' )::INTEGER total_recent from document_table doc left join key_pairs kp on
		kp.file_name=doc.file_name left join virgin_island.submissions sub on sub.submission_id=doc.submission_id 
        where (kp.field_name = 'APPLICANT:' or kp.field_name like 'CASE NAME:') ${user_role == 'applicant' ? `and sub.user_id='${user_id}'` : ``}  
		group by kp.field_value)
        select count(*)::INTEGER as total_record,sum(total_open)::INTEGER as total_open,sum(total_awaiting)::INTEGER as total_awaiting ,sum(total_recent)::INTEGER as total_recent from final_table`
        let result = await runQuery(contextOltp, sqlQuery)
        let count_records = await runQuery(contextOltp, sqlQueryCount)
        let total_records = count_records[0]?.total_record
        let total_open = count_records[0]?.total_open
        let total_await = count_records[0]?.total_awaiting
        let total_recent = count_records[0]?.total_recent

        let obj = { success: true, data: result, total_records, total_open, total_await, total_recent }
        return apiResponse(res, 200, obj)
    } catch (error) {
        console.log('error', error?.message)
        return successFalse(res, error?.message)
    }
}

const getAllActiveApplicants = async (req, res) => {
    try {
        let user_id = req?.query?.user_id
        let user_role = req?.query?.user_role

        let rowsPerPage = req?.query?.rowsPerPage
        let page = req?.query?.page

        rowsPerPage = rowsPerPage ? rowsPerPage : 10
        page = page ? page : 0
        limit = rowsPerPage
        // page = page || 1
        let offset = (page) * rowsPerPage

        let sqlQuery
        if (user_role == 'applicant') {

            sqlQuery = ` with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
           document_name, document_type,case_no, status,case_status,adjudicate_status, created_at, updated_at, case_category,is_deleted FROM virgin_island.documents),
           key_pairs as (select * from context.schema_form_key_pairs)
           select kp.field_value as applicant_name,concat('case-',(array_agg(doc.case_no))[1]) case_id,(array_agg(doc.case_category))[1] case_type,count(doc.*)::INTEGER as total_submission,
           TO_CHAR(((array_agg(doc.created_at))[1]),'Mon dd, yyyy hh12:mi AM') last_date,
           count(doc.case_status) filter (where doc.case_status='Awaiting Information') 
           awaiting_applicant_info,count(doc.case_status) filter (where doc.case_status='Assigned') 
           assigned,count(doc.adjudicate_status) filter (where doc.adjudicate_status='Completed') 
           completed from document_table doc left join key_pairs kp on kp.file_name=doc.file_name 
           left join virgin_island.submissions sub on sub.submission_id=doc.submission_id left join virgin_island.users us on us.user_id=sub.user_id
           where kp.field_name = 'APPLICANT:' and (doc.case_status !='Completed' and doc.case_status !='Closed') and us.role ='applicant' and sub.user_id='${user_id}'
           group by applicant_name limit ${limit} offset ${offset}`
        }
        else {
            sqlQuery = ` with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
            document_name, document_type,case_no, status,case_status,adjudicate_status, created_at, updated_at, case_category,is_deleted FROM virgin_island.documents),
            key_pairs as (select * from context.schema_form_key_pairs)
            select kp.field_value as applicant_name,concat('case-',(array_agg(doc.case_no))[1]) case_id,(array_agg(doc.case_category))[1] case_type,count(doc.*)::INTEGER as total_submission,
            TO_CHAR(((array_agg(doc.created_at))[1]),'Mon dd, yyyy hh12:mi AM') last_date,
            count(doc.case_status) filter (where doc.case_status='Awaiting Information') 
            awaiting_applicant_info,count(doc.case_status) filter (where doc.case_status='Assigned') 
            assigned,count(doc.adjudicate_status) filter (where doc.adjudicate_status='Completed') 
            completed from document_table doc left join key_pairs kp on kp.file_name=doc.file_name 
            left join virgin_island.submissions sub on sub.submission_id=doc.submission_id left join virgin_island.users us on us.user_id=sub.user_id
            where kp.field_name = 'APPLICANT:' and (doc.case_status !='Completed' or doc.case_status !='Closed')
            group by applicant_name limit ${limit} offset ${offset}`
        }

        let sqlQueryCount = `with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
        document_name, document_type, status,is_open, created_at, updated_at,adjudicate_status, is_deleted FROM virgin_island.documents),
        key_pairs as (select * from context.schema_form_key_pairs),
        final_table as (select kp.field_value,array_agg(doc.file_id),count(doc.file_name) filter (where doc.is_open is true)::INTEGER total_open,count(doc.file_name) filter
		(where doc.adjudicate_status = 'Requires Review')::INTEGER total_awaiting,count(doc.file_name) filter (where ( NOW() - doc.created_at) < '1 day' )::INTEGER total_recent from document_table doc left join key_pairs kp on
		kp.file_name=doc.file_name left join virgin_island.submissions sub on sub.submission_id=doc.submission_id 
        where kp.field_name = 'APPLICANT:' ${user_role == 'applicant' ? `and sub.user_id='${user_id}'` : ``}  
		group by kp.field_value)
        select count(*)::INTEGER as total_record,sum(total_open)::INTEGER as total_open,sum(total_awaiting)::INTEGER as total_awaiting ,sum(total_recent)::INTEGER as total_recent from final_table`
        let result = await runQuery(contextOltp, sqlQuery)
        let count_records = await runQuery(contextOltp, sqlQueryCount)
        let total_records = count_records[0]?.total_record
        let total_open = count_records[0]?.total_open
        let total_await = count_records[0]?.total_awaiting
        let total_recent = count_records[0]?.total_recent

        let obj = { success: true, data: result, total_records, total_open, total_await, total_recent }
        return apiResponse(res, 200, obj)
    } catch (error) {
        console.log('error', error?.message)
        return successFalse(res, error?.message)
    }
}
const getAllCompletedApplicants = async (req, res) => {
    try {
        let user_id = req?.query?.user_id
        let user_role = req?.query?.user_role

        let rowsPerPage = req?.query?.rowsPerPage
        let page = req?.query?.page

        rowsPerPage = rowsPerPage ? rowsPerPage : 10
        page = page ? page : 0
        limit = rowsPerPage
        // page = page || 1
        let offset = (page) * rowsPerPage

        let sqlQuery
        if (user_role == 'applicant') {

            sqlQuery = ` with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
           document_name, document_type,case_no, status,case_status,adjudicate_status, created_at, updated_at, case_category,is_deleted FROM virgin_island.documents),
           key_pairs as (select * from context.schema_form_key_pairs)
           select kp.field_value as applicant_name,concat('case-',(array_agg(doc.case_no))[1]) case_id,(array_agg(doc.case_category))[1] case_type,count(doc.*)::INTEGER as total_submission,
           TO_CHAR(((array_agg(doc.created_at))[1]),'Mon dd, yyyy hh12:mi AM') last_date,
           count(doc.case_status) filter (where doc.case_status='Awaiting Information') 
           awaiting_applicant_info,count(doc.case_status) filter (where doc.case_status='Assigned') 
           assigned,count(doc.adjudicate_status) filter (where doc.adjudicate_status='Completed') 
           completed from document_table doc left join key_pairs kp on kp.file_name=doc.file_name 
           left join virgin_island.submissions sub on sub.submission_id=doc.submission_id left join virgin_island.users us on us.user_id=sub.user_id
           where kp.field_name = 'APPLICANT:' and (doc.case_status ='Completed' or doc.case_status ='Closed') and us.role ='applicant' and sub.user_id='${user_id}'
           group by applicant_name limit ${limit} offset ${offset}`
        }
        else {
            sqlQuery = ` with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
            document_name, document_type,case_no, status,case_status,adjudicate_status, created_at, updated_at, case_category,is_deleted FROM virgin_island.documents),
            key_pairs as (select * from context.schema_form_key_pairs)
            select kp.field_value as applicant_name,concat('case-',(array_agg(doc.case_no))[1]) case_id,(array_agg(doc.case_category))[1] case_type,count(doc.*)::INTEGER as total_submission,
            TO_CHAR(((array_agg(doc.created_at))[1]),'Mon dd, yyyy hh12:mi AM') last_date,
            count(doc.case_status) filter (where doc.case_status='Awaiting Information') 
            awaiting_applicant_info,count(doc.case_status) filter (where doc.case_status='Assigned') 
            assigned,count(doc.adjudicate_status) filter (where doc.adjudicate_status='Completed') 
            completed from document_table doc left join key_pairs kp on kp.file_name=doc.file_name 
            left join virgin_island.submissions sub on sub.submission_id=doc.submission_id left join virgin_island.users us on us.user_id=sub.user_id
            where kp.field_name = 'APPLICANT:' and (doc.case_status ='Completed' or doc.case_status ='Closed')
            group by applicant_name limit ${limit} offset ${offset}`
        }

        let sqlQueryCount = `with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
        document_name, document_type, status,is_open, created_at, updated_at,adjudicate_status, is_deleted FROM virgin_island.documents),
        key_pairs as (select * from context.schema_form_key_pairs),
        final_table as (select kp.field_value,array_agg(doc.file_id),count(doc.file_name) filter (where doc.is_open is true)::INTEGER total_open,count(doc.file_name) filter
		(where doc.adjudicate_status = 'Requires Review')::INTEGER total_awaiting,count(doc.file_name) filter (where ( NOW() - doc.created_at) < '1 day' )::INTEGER total_recent from document_table doc left join key_pairs kp on
		kp.file_name=doc.file_name left join virgin_island.submissions sub on sub.submission_id=doc.submission_id 
        where kp.field_name = 'APPLICANT:' ${user_role == 'applicant' ? `and sub.user_id='${user_id}'` : ``}  
		group by kp.field_value)
        select count(*)::INTEGER as total_record,sum(total_open)::INTEGER as total_open,sum(total_awaiting)::INTEGER as total_awaiting ,sum(total_recent)::INTEGER as total_recent from final_table`
        let result = await runQuery(contextOltp, sqlQuery)
        let count_records = await runQuery(contextOltp, sqlQueryCount)
        let total_records = count_records[0]?.total_record
        let total_open = count_records[0]?.total_open
        let total_await = count_records[0]?.total_awaiting
        let total_recent = count_records[0]?.total_recent

        let obj = { success: true, data: result, total_records, total_open, total_await, total_recent }
        return apiResponse(res, 200, obj)
    } catch (error) {
        console.log('error', error?.message)
        return successFalse(res, error?.message)
    }
}

const getFormsByApplicantName = async (req, res) => {
    try {
        let user_id = req?.query?.user_id
        let applicant_name = req?.query?.applicant_name
        let rowsPerPage = req?.query?.rowsPerPage
        let page = req?.query?.page

        rowsPerPage = rowsPerPage ? rowsPerPage : 10
        page = page ? page : 0
        limit = rowsPerPage
        // page = page || 1
        let offset = (page) * rowsPerPage

        let sqlQuery = `with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
        document_name, document_type, status,case_status ,created_at, updated_at, is_deleted FROM virgin_island.documents)
        select doc.created_at::date,kp.field_value,doc.document_name as forms,us.name as submitted_by,doc.file_id as submission,doc.case_status,doc.submission_id ,'view' as submit from document_table doc left join context.schema_form_key_pairs kp on kp.file_name=doc.file_name left join virgin_island.submissions sub on sub.submission_id=doc.submission_id left join virgin_island.users us on us.user_id=sub.user_id where kp.field_name = 'APPLICANT:' and kp.field_value='${applicant_name}'`
        let result = await runQuery(contextOltp, sqlQuery)
        let assigned = []
        let pending_action = []
        result?.map(app => {
            if (app?.case_status == 'Assigned') {
                assigned.push(app?.case_status)
            }
            else if (app?.case_status == 'Pending Action') {
                pending_action.push(app?.case_status)
            }
        })
        let obj = { success: true, data: result, total_assigned: assigned?.length, total_pending: pending_action?.length }
        return apiResponse(res, 200, obj)


    } catch (error) {
        console.log('error', error?.message)
        return successFalse(res, error?.message)
    }
}

const getApplicantInformation = async (req, res) => {
    try {
        let user_id = req?.query?.user_id
        let applicant_name = req?.query?.applicant_name
        let rowsPerPage = req?.query?.rowsPerPage
        let page = req?.query?.page

        rowsPerPage = rowsPerPage ? rowsPerPage : 10
        page = page ? page : 0
        limit = rowsPerPage
        // page = page || 1
        let offset = (page) * rowsPerPage

        let sqlQuery = `with document_table as (SELECT CONCAT('form-',file_id,'-',document_name) as file_name,file_id ,submission_id,
        document_name, document_type, status, created_at, updated_at, is_deleted FROM virgin_island.documents)
         ,info_table as (select ARRAY_AGG(kp.field_name) field_names,ARRAY_AGG(kp.field_value) field_values,doc.file_id,doc.created_at from document_table doc left join
         context.schema_form_key_pairs kp on kp.file_name=doc.file_name left join virgin_island.submissions sub 
         on sub.submission_id=doc.submission_id left join virgin_island.users us on us.user_id=sub.user_id where 
         (kp.field_name = 'APPLICANT:' or kp.field_name like '%CASE NAME:%' or kp.field_name like 'SSN' or kp.field_name like '%HOME ADDRESS%' or kp.field_name like '%HOME PHO%' or kp.field_name like '%WORK PHO%' or kp.field_name like '%Cell:%' or kp.field_name like '%MOBILE PHO%' or kp.field_name like '%TANF%' or kp.field_name like '%AGED%' or kp.field_name like '%EMANCIPATED MIN%' or kp.field_name like '%FOSTER CA%' or kp.field_name like '%DISABL%')  group by doc.file_id,doc.created_at order by doc.created_at desc)
         select * from info_table where '${applicant_name}' = any(field_values) limit 1`
        let result = await runQuery(contextOltp, sqlQuery)
        let info = {}
        result[0]?.field_names?.map((key_names, index) => {
            console.log('key_names', key_names, result[0].field_values[index])
            if (key_names.toUpperCase().includes('APPLICA') || key_names.toUpperCase().includes('CASE NAME:')) {
                info.applicant = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('HOME ADD')) {
                info.address = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('HOME PHO')) {
                info.phone = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('WORK PHO')) {
                info.work_ph = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('MOBILE PHO') || key_names.toUpperCase().includes('Cell:')) {
                info.mobile = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('TANF')) {
                info.is_tanf = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('AGED')) {
                info.is_age = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('EMANCIPATED MIN')) {
                info.is_minor = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('FOSTER CA')) {
                info.foster_care = result[0].field_values[index]
            }
            else if (key_names.toUpperCase().includes('DISABL')) {
                info.is_disable = result[0].field_values[index]
            }
        })
        info.created_at = result[0]?.created_at
        let obj = { success: true, data: info }
        return apiResponse(res, 200, obj)


    } catch (error) {
        console.log('error', error?.message)
        return successFalse(res, error?.message)
    }
}

const getBySubmissionId = async (req, res) => {

    try {
        let { key, project_id, search, folders, limit, processing, submission_id, file_id } = req.query
        let userSharedArtifacts = []
        let selectQuery = file_id ? `SELECT submission_id,array_agg(file_id) artifact_ids,array_agg(case_status) case_statuses,array_agg(priority) priorities FROM virgin_island.documents where file_id ='${file_id}' group by submission_id` : `SELECT submission_id,array_agg(file_id) artifact_ids,array_agg(case_status) case_statuses,array_agg(priority) priorities FROM virgin_island.documents where submission_id='${submission_id}' group by submission_id`

        let case_status_priority = []
        let artifactList = await runQuery(contextOltp, selectQuery)
        artifactList?.[0]?.artifact_ids?.map((artifact_id, index) => {
            let obj = {
                id: artifact_id,
                case: artifactList?.[0]?.case_statuses[index],
                priority: artifactList?.[0]?.priorities[index]
            }
            case_status_priority.push(obj)
        })
        // let case_status = artifactList?.[0]?.case_statuses
        // let priorities = artifactList?.[0]?.priorities
        project_id = 'd16547d4-6d32-46e8-baf8-360a746005da'
        artifactList = artifactList?.[0]?.artifact_ids
        artifactList = "'" + artifactList.join("','") + "'";
        console.log(artifactList.toString(), '<== artifactList')
        // return apiResponse(res,200,{data:artifactList})
        let whereStatement = 'WHERE'

        if (!project_id) {

            let message = 'Please Provide Project Id'

            return successFalse(res, message, 402)
        }

        let user_project = `f.project_id='${project_id}' AND a.is_deleted IS NOT TRUE AND a.id IS NOT NULL AND a.expires_at >= NOW()`

        let cond = ``
        if (search?.length && key?.length && folders?.length) {
            for (var e of key) {
                for (var f of folders) {
                    whereStatement += ` ${cond} ${user_project} AND a.file_type='${e}' AND a.original_artifact_name LIKE '%${search}%' AND f.name='${f}'`
                    cond = `OR`
                }
            }
        }
        else if (key?.length && folders?.length) {
            for (var e of key) {
                for (var f of folders) {
                    whereStatement += ` ${cond} ${user_project} AND a.file_type='${e}' AND f.name='${f}'`
                    cond = `OR`
                }
            }
        }
        else if (search?.length && key?.length) {
            for (var e of key) {
                whereStatement += ` ${cond} ${user_project} AND a.file_type='${e}' AND a.original_artifact_name LIKE '%${search}%'`
                cond = `OR`
            }
        }
        else if (search?.length && folders?.length) {
            for (var f of folders) {
                whereStatement += ` ${cond} ${user_project} AND a.original_artifact_name LIKE '%${search}%' AND f.name='${f}'`
                cond = `OR`
            }
        }
        else if (search?.length) {
            whereStatement += ` ${cond} ${user_project} AND a.original_artifact_name LIKE '%${search}%'`
            cond = `OR`
        }
        else if (key?.length) {
            for (var e of key) {
                whereStatement += ` ${cond} ${user_project} AND a.file_type='${e}'`
                cond = `OR`
            }
        }
        else if (folders?.length) {
            for (var f of folders) {
                whereStatement += ` ${cond} ${user_project} AND f.name='${f}'`
                cond = `OR`
            }
        }
        else {
            whereStatement += ` ${user_project}`
        }

        if (processing) {
            whereStatement += ` AND a.is_completed IS true`
            whereStatement += ` AND a.id in (${artifactList.toString()})`
        }

        let filesLimit = limit && isNumber(Number(limit)) ? `LIMIT ${limit}` : ''
        let sqlQuery = `SELECT a.id, a.artifact_name, a.original_artifact_name, a.artifact_size, a.form_id, a.form_name, a.is_validate, a.md5, a.training_operation_name, a.dataset_csv, a.artifact_type, a.file_address, a.is_completed, a.user_id, a.file_type, a.created_at, b.explicit_content, f.id as folder_id, f.name as folder_name, a.executed, a.original_file_address, a.project_id, a.redacted_file_address, a.file_versions, a.artifact_name_versions
        FROM share_artifacts s
        LEFT JOIN folders f ON f.id = s.share_id
        LEFT JOIN artifacts a ON a.id = s.artifact_id
        LEFT JOIN context.ai_explicit_contents b
        ON b.artifact_name = a.artifact_name
        ${whereStatement}
        ORDER BY a.created_at DESC ${filesLimit}`
        // Run the query
        runQuery(contextOltp, sqlQuery)
            .then(async (rows) => {
                if (rows.length > 0) {
                    let result

                    for (var i in rows) {
                        rows[i].file_address = await getAuthUrl(rows?.[i]?.file_address, storage)
                        if (rows[i]?.redacted_file_address) {
                            rows[i].redacted_file_address = await getAuthUrl(rows?.[i]?.redacted_file_address, storage)
                        }
                        rows[i].shared = false
                        let obj_case = case_status_priority.find(o => o.id === rows[i]?.id);
                        rows[i].case_status = obj_case?.case ? obj_case?.case : 0
                        rows[i].priority = obj_case?.priority ? obj_case?.priority : 0
                        // console.log('case_status =>', case_status?.[i])
                        rows[i].submission_id = submission_id
                        let originalFileAddress = rows?.[i]?.original_file_address
                        if (originalFileAddress) {
                            rows[i].original_file_address = await getAuthUrl(originalFileAddress, storage)
                        }

                        for (var j in rows[i].file_versions) {
                            rows[i].file_versions[j] = await getAuthUrl(rows[i]?.file_versions?.[j], storage)
                            rows[i].file_address = rows[i].file_versions[j]
                        }
                    }

                    if (userSharedArtifacts.length > 0) {
                        result = [...rows, ...userSharedArtifacts]
                    }
                    else {
                        result = rows
                    }

                    result = _.unionBy(result, 'id')
                    let folders_name = _.unionBy(result, 'folder_name')?.map(v => v?.folder_name)

                    let obj = { success: true, data: result, folders_name, project_id }
                    console.log("Data found")
                    return apiResponse(res, 200, obj)
                }
                else {
                    console.log("Data not found")
                    return successFalse(res, "Data not found", 404)
                }
            })
            .catch((e) => {
                console.log('error', e?.message)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('error', e?.message)
        return successFalse(res, e?.message)
    }
}
const getIncomeArtifact = async (req, res) => {

    try {
        let { key, folders, limit, submission_id, file_id, category } = req.query
        let userSharedArtifacts = []
        let processing = true
        let selectQuery = `SELECT array_agg(artifact_id) artifact_ids FROM virgin_island.case_docs cd where cd.file_id ='${file_id}' and cd.category_type='${category}' group by cd.file_id`

        // let case_status_priority = []
        let artifactList = await runQuery(contextOltp, selectQuery)
        if (!artifactList?.length) {
            return successFalse(res, 'no artifact found', 500)
        }
        // artifactList?.[0]?.artifact_ids?.map((artifact_id, index) => {
        //     let obj = {
        //         id: artifact_id,
        //         case: artifactList?.[0]?.case_statuses[index],
        //         priority: artifactList?.[0]?.priorities[index]
        //     }
        //     case_status_priority.push(obj)
        // })
        // let case_status = artifactList?.[0]?.case_statuses
        // let priorities = artifactList?.[0]?.priorities
        project_id = category == 'income' ? `b861f9c4-4d06-4640-9913-16ae035c7814` : category == 'expense' ? `6b414e07-320a-44c7-bda8-b81dbc27f7b6` : `36eb0fcf-b46a-47c7-ba42-5ee70a9e27f1`
        artifactList = artifactList?.[0]?.artifact_ids
        artifactList = "'" + artifactList.join("','") + "'";
        console.log(artifactList.toString(), '<== artifactList')
        // return apiResponse(res,200,{data:artifactList})
        let whereStatement = 'WHERE'

        if (!project_id) {

            let message = 'Please Provide Project Id'

            return successFalse(res, message, 402)
        }

        let user_project = `f.project_id='${project_id}' AND a.is_deleted IS NOT TRUE AND a.id IS NOT NULL AND a.expires_at >= NOW()`

        let cond = ``

        if (key?.length && folders?.length) {
            for (var e of key) {
                for (var f of folders) {
                    whereStatement += ` ${cond} ${user_project} AND a.file_type='${e}' AND f.name='${f}'`
                    cond = `OR`
                }
            }
        }
        else if (key?.length) {
            for (var e of key) {
                whereStatement += ` ${cond} ${user_project} AND a.file_type='${e}'`
                cond = `OR`
            }
        }
        else if (folders?.length) {
            for (var f of folders) {
                whereStatement += ` ${cond} ${user_project} AND f.name='${f}'`
                cond = `OR`
            }
        }
        else {
            whereStatement += ` ${user_project}`
        }

        if (processing) {
            whereStatement += ` AND a.is_completed IS true`
            whereStatement += ` AND a.id in (${artifactList.toString()})`
        }

        let filesLimit = limit && isNumber(Number(limit)) ? `LIMIT ${limit}` : ''
        let sqlQuery = `SELECT a.id, a.artifact_name, a.original_artifact_name, a.artifact_size, a.form_id, a.form_name, a.is_validate, a.md5, a.training_operation_name, a.dataset_csv, a.artifact_type, a.file_address, a.is_completed, a.user_id, a.file_type, a.created_at, b.explicit_content, f.id as folder_id, f.name as folder_name, a.executed, a.original_file_address, a.project_id, a.redacted_file_address, a.file_versions, a.artifact_name_versions
        FROM share_artifacts s
        LEFT JOIN folders f ON f.id = s.share_id
        LEFT JOIN artifacts a ON a.id = s.artifact_id
        LEFT JOIN context.ai_explicit_contents b
        ON b.artifact_name = a.artifact_name
        ${whereStatement}
        ORDER BY a.created_at DESC ${filesLimit}`
        // Run the query
        runQuery(contextOltp, sqlQuery)
            .then(async (rows) => {
                if (rows.length > 0) {
                    let result

                    for (var i in rows) {
                        rows[i].file_address = await getAuthUrl(rows?.[i]?.file_address, storage)
                        if (rows[i]?.redacted_file_address) {
                            rows[i].redacted_file_address = await getAuthUrl(rows?.[i]?.redacted_file_address, storage)
                        }
                        rows[i].shared = false
                        // let obj_case = case_status_priority.find(o => o.id === rows[i]?.id);
                        // rows[i].case_status = obj_case?.case ? obj_case?.case : 0
                        // rows[i].priority = obj_case?.priority ? obj_case?.priority : 0
                        // console.log('case_status =>', case_status?.[i])
                        rows[i].submission_id = submission_id
                        let originalFileAddress = rows?.[i]?.original_file_address
                        if (originalFileAddress) {
                            rows[i].original_file_address = await getAuthUrl(originalFileAddress, storage)
                        }

                        for (var j in rows[i].file_versions) {
                            rows[i].file_versions[j] = await getAuthUrl(rows[i]?.file_versions?.[j], storage)
                            rows[i].file_address = rows[i].file_versions[j]
                        }
                    }

                    if (userSharedArtifacts.length > 0) {
                        result = [...rows, ...userSharedArtifacts]
                    }
                    else {
                        result = rows
                    }

                    result = _.unionBy(result, 'id')
                    let folders_name = _.unionBy(result, 'folder_name')?.map(v => v?.folder_name)

                    let obj = { success: true, data: result, folders_name, project_id }
                    console.log("Data found")
                    return apiResponse(res, 200, obj)
                }
                else {
                    console.log("Data not found")
                    return successFalse(res, "Data not found", 404)
                }
            })
            .catch((e) => {
                console.log('error', e?.message)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('error', e?.message)
        return successFalse(res, e?.message)
    }
}

const getIncomeArtifactKeyPairs = async (req, res) => {
    try {
        let artifact_name = req?.query?.artifact_name
        let sql = `select kp.field_name,kp.field_value from context.schema_form_key_pairs kp where kp.file_name='${artifact_name}'`
        let result = await runQuery(contextOltp, sql)
        let obj = { success: true, data: result }
        return apiResponse(res, 200, obj)
    } catch (e) {
        console.log('error', e?.message)
        return successFalse(res, e?.message)
    }
}
const getCaseStatusPriority = async (req, res) => {
    try {
        let artifact_name = req?.query?.file_id
        let sql = `select case_status,priority , notes from virgin_island.documents where file_id='${artifact_name}'`
        let result = await runQuery(contextOltp, sql)
        let obj = { success: true, data: result[0] }
        return apiResponse(res, 200, obj)
    } catch (e) {
        console.log('error', e?.message)
        return successFalse(res, e?.message)
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const extractingEntities = async (req, res) => {
    try {
        let file_id = req?.query?.file_id
        // let file_name = req?.query?.file_name
        // let artifact_name = `form-${file_id}-${file_name}`
        let sql = `select art.is_completed from public.artifacts art left join virgin_island.documents doc on art.artifact_name=concat('form-',doc.file_id,'-',doc.document_name) where doc.file_id ='${file_id}'`
        let result = await runQuery(contextOltp, sql)
        let count = 0
        while (!result[0]?.is_completed) {
            await sleep(15000)
            result = await runQuery(contextOltp, sql)
            count = count + 1
            if (count > 10) {
                break
            }

        }
        if (count < 10) {
            let selectQuery = `with my_key_pair as (select field_name,field_value,kp.field_value_confidence
                as kp_confidence from context.schema_form_key_pairs kp left join virgin_island.documents doc on
                kp.file_name=concat('form-',doc.file_id,'-',doc.document_name) where 
                doc.file_id='${file_id}')
                select * from my_key_pair  where kp_confidence <= '0.9'`
            let key_pairs = await runQuery(contextOltp, selectQuery)
            let obj = { success: true, key_pairs }
            return apiResponse(res, 200, obj)
        }
        else {
            let obj = { success: false, message: 'key pairs extraction failed!' }
            return apiResponse(res, 500, obj)
        }

    } catch (e) {
        console.log('error', e?.message)
        return successFalse(res, e?.message)
    }
}
const updateKeyPairsConfidence = async (req, res) => {
    try {
        let file_id = req?.body?.file_id
        let key_name = req?.body?.key_name
        // let file_name = req?.query?.file_name
        // let artifact_name = `form-${file_id}-${file_name}`
        let sql = `select art.is_completed from public.artifacts art left join virgin_island.documents doc on art.artifact_name=concat('form-',doc.file_id,'-',doc.document_name) where doc.file_id ='${file_id}'`
        let result = await runQuery(contextOltp, sql)
        let count = 0
        while (!result[0]?.is_completed) {
            await sleep(15000)
            result = await runQuery(contextOltp, sql)
            count = count + 1
            if (count > 10) {
                break
            }

        }
        if (count < 10) {
            // let selectQuery = `with my_key_pair as (select field_name,field_value,kp.field_value_confidence
            //     as kp_confidence from context.schema_form_key_pairs kp left join virgin_island.documents doc on
            //     kp.file_name=concat('form-',doc.file_id,'-',doc.document_name) where 
            //     doc.file_id='${file_id}')
            //     select * from my_key_pair  where kp_confidence <= '0.9'`
            let updateQuery = `update context.schema_form_key_pairs set field_value_confidence='0.95' where file_name in (select concat('form-',file_id,'-',document_name) from virgin_island.documents where file_id='${file_id}') and field_name='${key_name}' and field_value_confidence <'0.9' `
            let key_pairs = await runQuery(contextOltp, updateQuery)
            let obj = { success: true, key_pairs }
            return apiResponse(res, 200, obj)
        }
        else {
            let obj = { success: false, message: 'key pairs extraction failed!' }
            return apiResponse(res, 500, obj)
        }

    } catch (e) {
        console.log('error', e?.message)
        return successFalse(res, e?.message)
    }
}

const getNotes = async (req, res) => {
    try {
        let file_id = req?.query?.file_id
        let page = req?.query?.page || 0
        let offset = page * 5

        let sqlQuery = `SELECT n.id, n.case_id, n.user_id, n.notes_text, n.created_at, us."name"
        FROM virgin_island.notes n LEFT JOIN virgin_island.users us on us.user_id = n.user_id WHERE n.is_deleted IS NOT TRUE AND n.case_id = '${file_id}' order by n.created_at desc limit 5 offset ${offset}`
        let result = await runQuery(contextOltp, sqlQuery)

        let countQuery = `select count(n.*) total_records FROM virgin_island.notes n WHERE n.is_deleted IS NOT TRUE AND n.case_id = '${file_id}' group by n.case_id`
        let count = await runQuery(contextOltp, countQuery)

        let obj = {
            success: true,
            data: result,
            total_records: count[0]?.total_records || 0
        }

        return apiResponse(res, 200, obj)

    }
    catch (e) {
        console.log('error', e?.message)
        return successFalse(res, e?.message)
    }
}

module.exports = {
    getDocumentsBySubmissionId,
    getAllSubmissions,
    getBySubmissionId,
    getAllDocuments,
    getRecentDate,
    getAllApplicants,
    getFormsByApplicantName,
    getApplicantInformation,
    getAdjudicateStatus,
    getDashboardCaseCount,
    getCasesDetailByDocId,
    getSupportingDocsIncome,
    getSupportingDocsExpense,
    searchApplicant,
    getIncomeArtifact,
    getIncomeArtifactKeyPairs,
    getCaseStatusPriority,
    extractingEntities,
    getNotes,
    searchWithinApplicant,
    getAllCompletedApplicants,
    getAllActiveApplicants,
    updateKeyPairsConfidence
}