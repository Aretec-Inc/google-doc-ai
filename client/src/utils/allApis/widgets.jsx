const host = 'http://localhost:8080'
const api = `${host}/api`

const widget_api = `${api}/widgets`

const WIDGET_APIS = {
    POST: {
        WIDGETS_ADD_UPDATE: `${widget_api}/add_update`,
        WIDGETS_DELETE: `${widget_api}/delete`,
        WIDGETS_UPDATE_MULTIPLE: `${widget_api}/update_multiple`
    },
    GET: {
        WIDGETS_GET_WIDGET: `${widget_api}/get_widget`
    }
}

export default WIDGET_APIS