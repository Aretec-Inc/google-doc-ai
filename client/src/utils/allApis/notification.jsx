const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8035`
const api = `${host}/api`

const notifications_api = `${api}/notifications`

const NOTIFICATIONS_APIS = {
  POST: {
    NOTIF_CREATE_NOTIFICATION: `${notifications_api}/create_notification`,
    NOTIF_UPDATE_NOTIFICATION: `${notifications_api}/update_notification`
  },
  GET: {
    NOTIF_GET_NOTIFICATION_BY_USER_ID: `${notifications_api}/get_notification_by_user_id`
  }
}

export default NOTIFICATIONS_APIS