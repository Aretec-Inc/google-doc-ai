const host = 'https://rating-api-2my7afm7yq-ue.a.run.app'
// const host = 'https://backend.neptunestech.com:8047'
const api = `${host}/api`

const ratings_api = `${api}/ratings`

const RATINGS_APIS = {
    POST: {
        ADD_RATING: `${ratings_api}/add_rating`
    },
    GET: {
        GET_AGGREGATE_RATING: `${ratings_api}/get_aggregate_rating`
    }
}

export default RATINGS_APIS