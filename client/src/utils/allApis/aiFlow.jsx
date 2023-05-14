const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8001`
const api = `${host}/api`
const ai_flow_api = `${api}/ai_flow`;


const AI_FLOW_APIS = {
    POST: {
        ADD_FLOW_PROP_FILES: `${ai_flow_api}/upload`,
        ADD_AI_FLOW: `${ai_flow_api}/add_flow`,
        UPDATE_AI_FLOW: `${ai_flow_api}/update_flow`,
        DELETE_AI_FLOW: `${ai_flow_api}/delete_flow`
    },
    GET: {
        GET_AI_FLOW: `${ai_flow_api}/get_flow`,
        GET_AI_FLOW_BY_USERID: `${ai_flow_api}/by_user_id`
    }
}

export default AI_FLOW_APIS;