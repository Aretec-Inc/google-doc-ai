const api = `/api`
// const authApi = `http://localhost:8080/api/virgin_island`
const Origin = 'http://localhost:3000'


const GET = {
    ALL_PROCESSORS: `${api}/get-all-processors`,
    ALL_SUBMISSIONS: `${api}/get-all-submissions`,
    DOCUMENTS_BY_ID: `${api}/get-documents-by-id`,
    PDF_DATA: `${api}/get-pdf-data`
}

const POST = {
    GET_UPLOAD_URL: `${api}/get-upload-signed-url`,
    UPLOAD_DOCUMENTS: `${api}/upload-documents`,
    CREATE_SUBMISSION: `${api}/create-submission`
}


export {
    GET,
    POST,
    Origin
}