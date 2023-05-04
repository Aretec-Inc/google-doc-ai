const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8045`
const api = `${host}/api`


const big_query_api = `${api}/big_query`

const BIG_QUERY_APIS = {
    POST: {
        BQ_GET_MULTIMEDIA: `${big_query_api}/get_multimedia`,
        BQ_GET_ALL_IMAGES_DATA: `${big_query_api}/get_all_images_data`,
        BQ_GET_DATA_FOR_FILE_VISUALIZATION: `${big_query_api}/get_data_for_file_visualization`,
        BQ_GET_EXPLICIT_FILES: `${big_query_api}/get_explicit_files`,
        BQ_CREATE_MODEL: `${big_query_api}/create_model`
    },
    GET: {
        BQ_GET_VIDEO_DATA: `${big_query_api}/get_video_data`,
        BQ_GET_IMAGE_DATA: `${big_query_api}/get_image_data`,
        BQ_GET_DOC_DATA: `${big_query_api}/get_doc_data`,
        BQ_GET_AUDIO_DATA: `${big_query_api}/get_audio_data`,
        BQ_GET_FILE_DATA_FROM_VID_FINAL: `${big_query_api}/get_file_data_from_vid_final`,
        BQ_GET_WORD_MAP_DATA: `${big_query_api}/get_word_map_data`,
        BQ_UPLOAD_ACTIVITY: `${big_query_api}/upload_activity`,
        BQ_GET_COLUMNS_NAME: `${big_query_api}/get_columns_name`,
        BQ_GET_BIG_ML: `${big_query_api}/get_big_ml`,
        BQ_GET_OPTIONS: `${big_query_api}/get_options`,
        BQ_GET_TRAINING_INFO: `${big_query_api}/get_training_info`,
        BQ_GET_FEATURE_INFO: `${big_query_api}/get_feature_info`
    }
}

export default BIG_QUERY_APIS