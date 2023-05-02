const host = `https://video-annotation-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8055`
const api = `${host}/api`

const video_ai_api = `${api}/video_ai`

const VIDEO_AI_APIS = {
    GET: {
        GET_VIDEO_DATA: `${video_ai_api}/get_video_data`
    }
}

export default VIDEO_AI_APIS