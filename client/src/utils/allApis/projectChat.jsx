const host = `https://project-chat-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8042`
const api = `${host}/api`

const project_chat_api = `${api}/project_chat`

const PROJECT_CHAT_APIS = {
    POST: {
        UPLOAD_CHAT_FILES: `${project_chat_api}/upload_chat_files`
    }
}

export default PROJECT_CHAT_APIS