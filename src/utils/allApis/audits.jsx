const host = 'https://audit-api-2my7afm7yq-ue.a.run.app'
// const host = 'https://backend.neptunestech.com:8007'
const api = `${host}/api`

const audit_api = `${api}/audit`

const AUDITS_APIS = {
  POST: {
    AUDIT_ADD_AUDIT: `${audit_api}/add_audit`
  },
  GET: {
    AUDIT_PROJECT_ACTIVITIES: `${audit_api}/project_activities`,
    AUDIT_OVERAL_ACTIVITIES: `${audit_api}/overall_activities`,
    AUDIT_TOP_TEN_ACTIVE: `${audit_api}/top_ten_active`
  }
}

export default AUDITS_APIS