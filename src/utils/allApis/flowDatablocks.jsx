const host = 'https://flow-db-api-2my7afm7yq-ue.a.run.app'
// const host = 'https://backend.neptunestech.com:8023'
const api = `${host}/api`

const flow_datablocks_api = `${api}/flow_data_blocks`

const FLOW_DATABLOCKS_APIS = {
    POST: {
        SAVE_FLOW_DATABLOCKS: `${flow_datablocks_api}/save_flowdatablocks`,
        UPDATE_FLOW_DATABLOCKS: `${flow_datablocks_api}/update_flowdatablocks`,
        DELETE_FLOW_DATABLOCKS:`${flow_datablocks_api}/delete_flowdatablocks`,
        PROJECTS_FLOW_DATABLOCKS: `${flow_datablocks_api}/get_flowdatablocks_of_project`,
        GET_ROWS_FLOW_DATABLOCKS: `${flow_datablocks_api}/get_rows`,
        GET_TABLES_FLOW_DATABLOCKS: `${flow_datablocks_api}/get_tables`
    }
}

export default FLOW_DATABLOCKS_APIS