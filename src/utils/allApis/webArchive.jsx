const host = 'https://webarchive-api-2my7afm7yq-ue.a.run.app' || `http://localhost:8081`
// const host = 'https://backend.neptunestech.com:8056'
const api = `${host}/api`
const web_archive_api = `${api}/web_archive`

const WEB_ARCHIVE_APIS = {
    POST: {
        WEB_ARCHIVE_SCHEDULE: `${web_archive_api}/create_schedule` //done
    },
    GET: {
        WEB_ARCHIVE_DATA: `${web_archive_api}/get_data`,//done
        RUN_ARCHIVE: `${web_archive_api}/run_archive`,//done
        WEB_DATA: `${web_archive_api}/data`,//done
        ARCHIVE_BY_ID: `${web_archive_api}/archive_by_id`,//done
        ARCHIVE_BY_WEB: `${web_archive_api}/archives_by_web`,//done
        ARCHIVE_SCHEDULE_DATA: `${web_archive_api}/schedules_data`,//done
        WEB_PAGES_DATA: `${web_archive_api}/web_pages_data`,
        WEB_PAGE_DATA_BY_ID: `${web_archive_api}/web_page_data_by_id`
    }
}

export default WEB_ARCHIVE_APIS
