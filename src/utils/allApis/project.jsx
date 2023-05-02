const host = `https://project-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8041`

const api = `${host}/api`
const projects_api = `${api}/project`

const PROJECTS_APIS = {

    // POST APIS
    POST: {
        PROJECTS_CREATE_PROJECT: `${projects_api}/create_project`,
        PROJECTS_CREATE_ADDITIONAL_PROPERTIES: `${projects_api}/create_additional_properties`,
        PROJECTS_DELETE_TEMPLATE: `${projects_api}/delete_template`,
        PROJECTS_DELETE_PROJECT: `${projects_api}/delete_project`,
        PROJECTS_ADD_PROPERTY: `${projects_api}/add_property`,
        PROJECTS_DELETE_KEYWORD: `${projects_api}/delete_keyword`,
        PROJECTS_ADD_KEYWORD: `${projects_api}/add_keyword`,
        PROJECTS_UPDATE_KEYWORD: `${projects_api}/update_keyword`,
        PROJECTS_SHARE: `${projects_api}/share`
    },
    // GET APIS
    GET: {
        PROJECTS_BY_USER_ID: `${projects_api}/by_user_id`,
        PROJECTS_TEMPLATES: `${projects_api}/templates`,
        PROJECTS_PROJECT_MEMBERS: `${projects_api}/project_members`,
        PROJECTS_GET_ALL_PROJECTS: `${projects_api}/get_all_projects`,
        PROJECTS_PROJECT_CHAT: `${projects_api}/project_chat`,
        PROJECTS_GET_KEYWORD: `${projects_api}/get_keyword`,
        PROJECTS_GET_KEYWORD_BY_FILE: `${projects_api}/get_keyword_by_file`,
        PROJECTS_GET_NOTIFICATIONS: `${projects_api}/get_notification`,
        PROJECTS_GET_PROJECT_DATA: `${projects_api}/get_project_data`,
        PROJECTS_GET_ALL_ADDITIONAL_PROPERTIES: `${projects_api}/get_all_additional_properties`,
        VERIFY_PROJECT: `${projects_api}/verify_project`
    }
}

export default PROJECTS_APIS