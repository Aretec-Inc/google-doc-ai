const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8021`
const api = `${host}/api`

const source_connection_api = `${api}/upload_source_connection`

const SOURCE_CONNECTIONS_APIS = {
    POST: {
        ADD_CONNECTION: `${source_connection_api}/add_connection`,
        ONE_DRIVE_TOKEN: `${source_connection_api}/one_drive_token`,
        BOX_DATA: `${source_connection_api}/box_data`
    },
    GET: {
        SOURCE_CONNECTIONS: `${source_connection_api}/connections`,
        S3_BUCKET_DATA: `${source_connection_api}/s3_bucket_data`
    }
}

export default SOURCE_CONNECTIONS_APIS

// http://localhost:8080/api/upload_source_connection/connections