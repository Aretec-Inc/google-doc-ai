const host = `https://tag-apis-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8050`
const api = `${host}/api`

const tags_api = `${api}/tags`

const TAGS_APIS = {
  POST: {
    TAGS_ADD_TAG: `${tags_api}/add_tag`,
    TAGS_REMOVE_TAG: `${tags_api}/remove_tag`,
    TAGS_UPDATE_TAG: `${tags_api}/update_tag`
  },
  GET: {
    TAGS_GET_TAGS_BY_ARTIFACT_ID: `${tags_api}/get_tags_by_artifact_id`,
    TAGS_GET_TAGS_BY_USER_ID: `${tags_api}/get_tags_by_user_id`,
  }
}

export default TAGS_APIS