const host = 'https://context-api-2my7afm7yq-ue.a.run.app'
// const host = 'https://backend.neptunestech.com:8014'
const api = `${host}/api`

const data_dashboard_api = `${api}/data_dashboard`

const DATA_DASHBOARD_APIS = {
    GET: {
        DATA_DASHBOARD_COMPLETENESS: `${data_dashboard_api}/completeness`,
        DATA_DASHBOARD_GET_PROJECT_ANALYTICS: `${data_dashboard_api}/get_project_data`
    }
}

export default DATA_DASHBOARD_APIS