const host = 'https://context-api-2my7afm7yq-ue.a.run.app'
// const host = 'https://backend.neptunestech.com:8059'
const api = `${host}/api`

const workspace_api = `${api}/workspace`

const WORKSPACE_APIS = {
    POST: {
        ADD_WORKSPACE: `${workspace_api}/addWorkspace`
    },
    GET: {
        GET_WORKSPACES_BY_USER_ID: `${workspace_api}/by_user_id`,
        GET_SHARE_WORKSPACES: `${workspace_api}/shared`
    }
}

export default WORKSPACE_APIS;