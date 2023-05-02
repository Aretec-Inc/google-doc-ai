const host = `https://template-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8051`
const api = `${host}/api`

const template_api = `${api}/template`

const TEMPLATE_APIS = {
    POST: {
        UPLOAD_DATASET_FILES: `${template_api}/upload_dataset_files`,
        TRAIN_MODEL_ON_TEMPLATE: `${template_api}/train_model_on_template`
    }
}

export default TEMPLATE_APIS