import * as ALL_APIS from './allApis'

const { FLOW_DATABLOCKS_APIS, DATA_DASHBOARD_APIS, BIG_QUERY_APIS, PROJECTS_APIS, ARTIFACT, ACCOUNTS_APIS, WIDGET_APIS, WEB_ARCHIVE_APIS, SEARCH_APIS, AI_FLOW_APIS, BOOKMARKS_APIS, DASHBOARD_CHARTS, ARTIFACT_COMMENT_APIS, PROJECT_FLOW_APIS, TAGS_APIS, NOTIFICATIONS_APIS, FOLDERS_APIS, AUDITS_APIS, RATINGS_APIS, GRAPH_APIS, PDF_APIS, TEMPLATE_APIS, SOURCE_CONNECTIONS_APIS, PROJECT_CHAT_APIS, IMAGE_AI_APIS, APPROVAL_APIS, BQ_ML_APIS, VIDEO_AI_APIS, DOC_AI_APIS, INSIGHTS, DTALE_APIS, WORKSPACE_APIS } = ALL_APIS

const api = `/api`
// const authApi = `http://localhost:8080/api/virgin_island`
const Origin = 'http://localhost:3000'


const GET = {
    ALL_PROCESSORS: `${api}/get-all-processors`,
    ALL_SUBMISSIONS: `${api}/get-all-submissions`,
    FILES_BY_ID: `${api}/get-files-by-id`,
    DOCUMENTS_BY_ID: `${api}/get-documents-by-id`,
    PDF_DATA: `${api}/get-pdf-data`,
    DASHBOARD_DATA: `${api}/get-dashboard-data`,
    EXPORT_DATA: `${api}/get-export-data`,
    EXPORT_DATA_CSV: `${api}/export-data-csv`
}

const POST = {
    GET_UPLOAD_URL: `${api}/get-upload-signed-url`,
    UPLOAD_DOCUMENTS: `${api}/upload-documents`,
    CREATE_SUBMISSION: `${api}/create-submission`,
    UPDATE_KEY_PAIRS: `${api}/update-key-pairs`,
    VALIDATE_SERVICE_KEY_GCS: `${api}/validate-service-key-gcs`,
    GET_BUCKET_DATA: `${api}/get-bucket-data`,
    DOWNLOAD_AND_UPLOAD_FILES: `${api}/download-and-upload-files`,
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