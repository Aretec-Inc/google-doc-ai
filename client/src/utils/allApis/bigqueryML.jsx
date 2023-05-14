const host =`https://context-api-2my7afm7yq-ue.a.run.app`
// const host =`https://backend.neptunestech.com:8046`
const api = `${host}/api`


const big_query_ml_api = `${api}/bigQuery_ml`

const BQ_ML_APIS = {
    POST: {
        PREDICT_MODEL: `${big_query_ml_api}/predict_model`
    },
    GET: {
        EVALUATE_MODEL: `${big_query_ml_api}/evaluate_model`
    }
}

export default BQ_ML_APIS