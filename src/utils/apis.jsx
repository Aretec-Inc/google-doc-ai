import * as ALL_APIS from './allApis'

const { FLOW_DATABLOCKS_APIS, DATA_DASHBOARD_APIS, BIG_QUERY_APIS, PROJECTS_APIS, ARTIFACT, ACCOUNTS_APIS, WIDGET_APIS, WEB_ARCHIVE_APIS, SEARCH_APIS, AI_FLOW_APIS, AGENCY_FORMS_APIS, BOOKMARKS_APIS, DASHBOARD_CHARTS, ARTIFACT_COMMENT_APIS, PROJECT_FLOW_APIS, TAGS_APIS, NOTIFICATIONS_APIS, FOLDERS_APIS, AUDITS_APIS, RATINGS_APIS, GRAPH_APIS, PDF_APIS, TEMPLATE_APIS, SOURCE_CONNECTIONS_APIS, PROJECT_CHAT_APIS, IMAGE_AI_APIS, APPROVAL_APIS, BQ_ML_APIS, VIDEO_AI_APIS, DOC_AI_APIS, INSIGHTS, DTALE_APIS, WORKSPACE_APIS } = ALL_APIS

const authApi = `/api/virgin_island`
// const authApi = `http://localhost:8080/api/virgin_island`
const Origin = 'http://localhost:3000'


const GET = {
    BY_SUBMISSION_ID: `${authApi}/getBySubmissionId`,
    GETRECENTDATE: `${authApi}/getRecentDate`,
    GEALLAPPLICANTS: `${authApi}/getAllApplicants`,
    GETFORMBYAPPLICATIONNAME: `${authApi}/getFormsByApplicantName`,
    GETAPPLICANTINFO: `${authApi}/getApplicantInformation`,
    GETADJUDICATESTATUS: `${authApi}/getAdjudicateStatus`,
    GETDASHBOARDCASECOUNT: `${authApi}/getDashboardCaseCount`,
    GETCASEDETAILBYDOCID: `${authApi}/getCasesDetailByDocId`,
    GET_CASE_INCOME_BY_CASE_ID: `${authApi}/getSupportingDocsIncome`,
    GET_CASE_EXPENSE_BY_CASE_ID: `${authApi}/getSupportingDocsExpense`,
    GET_INCOME_ARTIFACT_KEY_PAIRS: `${authApi}/getIncomeArtifactKeyPairs`,
    GET_CASE_PDF: `${authApi}/getIncomeArtifact`,
    SEARCH_APPLICANT: `${authApi}/searchApplicant`,
    SEARCH_WITHIN_APPLICANT: `${authApi}/searchWithinApplicant`,
    GET_CASE_STATUS: `${authApi}/getCaseStatusPriority`,
    GET_EXTRACTING_ENTITIES: `${authApi}/extractingEntities`,
    GET_NOTES: `${authApi}/getNotes`,
    GET_ACTIVE_CASES: `${authApi}/getAllActiveApplicants`,
    GET_HISTORIC_CASES: `${authApi}/getAllCompletedApplicants`,
}

const POST = {
    UPLOAD_FILES: `${authApi}/upload`,
    UPLOAD_INCOME_FILE: `${authApi}/uploadIncome`,
    UPLOAD_IDENTITY_FILE: `${authApi}/uploadIdentity`,
    UPLOAD_FILES_CASE_DETAILS: `${authApi}/upload-supp-doc`,
    GET_ALL_SUBMISSIONS: `${authApi}/getAllSubmissions`,
    LOGIN: `${authApi}/login`,
    SIGNUP: `${authApi}/register`,
    UPDATE: `${authApi}/updateCasePriority`,
    GET_ALL_DOCUMENTS: `${authApi}/getAllDocuments`,
    GETDOCUMENTBYADJUDICATION: `${authApi}/getDocumentByAdjudication`,
    GETCASEBYCASESTATUS: `${authApi}/getCasesByCaseStatus`,
    GETCASEBYCATEGORY: `${authApi}/getCasesByCategory`,
    UPDATE_LAST_LOGIN: `${authApi}/last_login`,
    GETCASEDETAILS: `${authApi}/getCaseDetails`,
    UPDTAECASEPRIORITY: `${authApi}/updateCasePriority`,
    UPDTAE_CASE_NOTES: `${authApi}/updateCaseNotes`,
    UPLOAD_APPLICATION: `${authApi}/uploadApplication`,
    SUBMIT_APPLICATION: `${authApi}/submitApplication`,
    SUBMIT_FEEDBACK: `${authApi}/feedback`,
    ADD_NOTES: `${authApi}/addNotes`,
    UPDATE_KEY_PAIRS: `${authApi}/updateKeyPairsConfidence`,
}


export {
    GET,
    POST,
    Origin,
    FLOW_DATABLOCKS_APIS,
    DATA_DASHBOARD_APIS,
    BIG_QUERY_APIS,
    PROJECTS_APIS,
    ARTIFACT,
    ACCOUNTS_APIS,
    WIDGET_APIS,
    WEB_ARCHIVE_APIS,
    SEARCH_APIS,
    AI_FLOW_APIS,
    AGENCY_FORMS_APIS,
    BOOKMARKS_APIS,
    DASHBOARD_CHARTS,
    ARTIFACT_COMMENT_APIS,
    PROJECT_FLOW_APIS,
    TAGS_APIS,
    NOTIFICATIONS_APIS,
    FOLDERS_APIS,
    AUDITS_APIS,
    RATINGS_APIS,
    GRAPH_APIS,
    PDF_APIS,
    TEMPLATE_APIS,
    SOURCE_CONNECTIONS_APIS,
    PROJECT_CHAT_APIS,
    IMAGE_AI_APIS,
    APPROVAL_APIS,
    BQ_ML_APIS,
    VIDEO_AI_APIS,
    DOC_AI_APIS,
    INSIGHTS,
    DTALE_APIS,
    WORKSPACE_APIS
}