const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8017`
const api = `${host}/api`

const doc_ai_api = `${api}/doc_ai`

const DOC_AI_APIS = {
    GET: {
        GET_PROCESSORS: `${doc_ai_api}/processors`
    }
}

export default DOC_AI_APIS