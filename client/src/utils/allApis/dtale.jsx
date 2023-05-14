const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8019`
// const host = `http://localhost:8081`
const api = `${host}/api`

const dtale = `${api}/dtale`

const DTALE_APIS = {
    GET: {
        GET_DATA: `${dtale}/get_data`
    },
    POST: {
        GET_DATA_BY_DATASET: `${dtale}/get_data_by_dataset`
    }
}

export default DTALE_APIS