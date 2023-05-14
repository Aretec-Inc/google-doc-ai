const host = `https://context-api-2my7afm7yq-ue.a.run.app` || `http://localhost:8084`
// const host = `https://backend.neptunestech.com:8025`
const api = `${host}/api`
const folders_api = `${api}/folders`

const FOLDERS_APIS = {
  POST: {
    FOLDERS_CREATE_FOLDER: `${folders_api}/create_folder`,
    FOLDERS_DELETE_FOLDER: `${folders_api}/delete`,
    FOLDERS_ADD_ARTIFACTS: `${folders_api}/add_artifacts`,
    FOLDERS_REMOVE_ARTIFACTS: `${folders_api}/remove_artifacts`,
    FOLDERS_UPDATE: `${folders_api}/update`,
    FOLDERS_SHARE: `${folders_api}/share` //used
  },
  GET: {
    // GET APIS
    FOLDERS_GET_BY_USER_ID: `${folders_api}/by_user_id`,
    FOLDERS_GET_BY_USER_PROJECT_ID: `${folders_api}/by_user_project_id`,
    FOLDERS_GET_ARTIFACTS: `${folders_api}/get_artifacts`,
    FOLDERS_SHARED_FOLDERS: `${folders_api}/shared_folders` //not used
  }
}

export default FOLDERS_APIS