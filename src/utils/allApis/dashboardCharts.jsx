const host = 'https://dashboard-chart-api-2my7afm7yq-ue.a.run.app'
// const host = 'https://backend.neptunestech.com:8013'
const api = `${host}/api`
const dashboard_charts_api = `${api}/dashboard_chart`

const DASHBOARD_CHARTS_APIS = {
  POST: {
    DASHBOARD_ADD_CHART: `${dashboard_charts_api}/add_chart`,
    DASHBOARD_CHARTS_DELETE: `${dashboard_charts_api}/delete`,
    DASHBOARD_CHARTS_UPDATE_MULTIPLE: `${dashboard_charts_api}/update_multiple`
  },
  GET: {
    DASHBOARD_CHARTS_FIND_ALL: `${dashboard_charts_api}/find_all`
  }
}

export default DASHBOARD_CHARTS_APIS