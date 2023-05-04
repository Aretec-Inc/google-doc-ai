const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8000`
const api = `${host}/api`
const agency_forms_api = `${api}/agency_form`

const AGENCY_FORMS_APIS = {
    POST: {
        ADD_AGENCY: `${agency_forms_api}/add_agency`,
        DELETE_AGENCY: `${agency_forms_api}/delete_agency`,
        AGENCY_ADD_FORM: `${agency_forms_api}/add_form`,
        AGENCY_DELETE_FORM: `${agency_forms_api}/delete_form`,
    },
    GET: {
        GET_AGENCIES: `${agency_forms_api}/get_agencies`,
        GET_ALL_FORMS: `${agency_forms_api}/get_all_forms`,
        GET_FORMS_BY_AGENCY_ID: `${agency_forms_api}/get_forms_by_agency_id`
    }
}

export default AGENCY_FORMS_APIS;