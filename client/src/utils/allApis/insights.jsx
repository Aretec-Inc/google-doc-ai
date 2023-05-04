const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8032`
const api = `${host}/api`

const insights_api = `${api}/insights`

const insights_apiS = {
  GET: {
    PROJECT_INSIGHT: `${insights_api}/project_insight`
  }
}

export default insights_apiS