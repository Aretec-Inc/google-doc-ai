const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8002`

const api = `${host}/api`;

const approval_api = `${api}/approvals`;

const APPROVAL_APIS = {
    POST: {
        ADD_APPROVAL: `${approval_api}/add_approval`
    },
    GET: {
        GET_APPROVAL: `${approval_api}/get_approval`,
        APPROVAL_COUNT: `${approval_api}/count`
    }
}

export default APPROVAL_APIS;