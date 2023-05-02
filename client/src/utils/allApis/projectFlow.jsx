const host = `https://project-flow-api-2my7afm7yq-ue.a.run.app`
// const host = ` https://backend.neptunestech.com:8043`
const api = `${host}/api`
const project_flow_api = `${api}/project_flow`

const PROJECT_FLOW_APIS = {
  POST: {
    // POST
    P_FLOW_ADD_BUSSINESS_FUNCTION: `${project_flow_api}/add_bussiness_function`,
    P_FLOW_ADD_FLOW_RULE: `${project_flow_api}/add_flow_rule`,
    P_FLOW_ADD_BUSINESS_FLOW: `${project_flow_api}/add_business_flow`,
    P_FLOW_UPDATE_FLOW: `${project_flow_api}/update_flow`,
    P_FLOW_ADD_BACKEND_APIS: `${project_flow_api}/add_backend_apis`, // NOT INTEGRATED
    P_FLOW_EXECUTE: `${project_flow_api}/execute`
  },
  GET: {
    P_FLOW_GET_BUSSINESS_FUNCTION: `${project_flow_api}/get_bussiness_function`,
    P_FLOW_GET_FLOW_RULES: `${project_flow_api}/get_flow_rules`,
    P_FLOW_GET_FLOW_DETAILS: `${project_flow_api}/get_flow_details`,
    P_FLOW_GET_BUSINESS_FLOW: `${project_flow_api}/get_business_flow`,
    P_FLOW_GET_BACKEND_APIS: `${project_flow_api}/get_backend_apis`,
    P_FLOW_GET_TABLES: `${project_flow_api}/get_tables`,
    P_FLOW_GET_TABLE_COLUMNS: `${project_flow_api}/get_table_columns`
  }
}

export default PROJECT_FLOW_APIS
