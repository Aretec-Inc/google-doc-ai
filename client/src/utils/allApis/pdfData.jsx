const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8037`
const api = `${host}/api`

const pdf_data_api = `${api}/pdf_data`

const PDF_APIS = {
    POST: {
        CROP_PDF: `${pdf_data_api}/crop_pdf`,
        ADD_KEY_PAIRS: `${pdf_data_api}/add_keypairs`,
        DELETE_CUSTOM_FIELD: `${pdf_data_api}/delete_custom_field`,
        GENERATE_TABLE: `${pdf_data_api}}/generate_table`,
        UPDATE_KEY_PAIRS: `${pdf_data_api}/update_key_pairs`
    },
    GET: {
        GET_PDF_DATA: `${pdf_data_api}/get_pdf_data`,
        GET_CUSTOM_FIELDS: `${pdf_data_api}/get_custom_fields`,
        GET_CUSTOM_FIELDS_BY_ARTIFACT: `${pdf_data_api}/get_custom_fields_by_artifact`
    }
}

export default PDF_APIS