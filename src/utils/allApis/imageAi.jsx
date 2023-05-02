const host = `https://image-annotation-api-2my7afm7yq-ue.a.run.app`
// const host = ` https://backend.neptunestech.com:8029`
const api = `${host}/api`

const image_ai_api = `${api}/image_ai`

const IMAGE_AI_APIS = {
    POST: {
        IMAGE_AI_NOTE: `${image_ai_api}/note`,
        IMAGE_AI_DELETE_NOTE: `${image_ai_api}/delete_note`
    },
    GET: {
        GET_IMAGE_AI_DATA: `${image_ai_api}/get_image_ai_data`,
        GET_IMAGE_AI_NOTES: `${image_ai_api}/notes`
    }
}

export default IMAGE_AI_APIS