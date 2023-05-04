const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8005`
const api = `${host}/api`
const artifact_comments_api = `${api}/artifact_comment`

const ARTIFACT_COMMENT_APIS = {
  POST: {
    ARTIFACT_ADD_COMMENT: `${artifact_comments_api}/add_comment`,
  },
  GET: {
    ARTIFACT_FIND_ALL_ARTIFACT_COMMENTS: `${artifact_comments_api}/find_all_artifact_comments`
  }
}

export default ARTIFACT_COMMENT_APIS
