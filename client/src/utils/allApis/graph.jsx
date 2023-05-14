const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8048`
const api = `${host}/api`

const graph_api = `${api}/graph`
const GRAPH_APIS = {
  POST: {
    UPLOAD_GRAPH_QUERY: `${graph_api}/upload_graph_query`,
    UPDATE_GRAPH_BY_ID: `${graph_api}/update_graph`,
    DELETE_GRAPH_BY_Id: `${graph_api}/delete_graph`
  },
  GET: {
    GET_GRAPH_BY_USER: `${graph_api}/get_graph_by_user`,
    GET_GRAPH_BY_ID: `${graph_api}/get_graph_by_id`, //not use in front end,
    NEO4J_QUERY: `${graph_api}/neo4j_query`
  }
}

export default GRAPH_APIS