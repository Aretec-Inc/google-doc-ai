const host = `https://artifact-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com:8004`
// const host = `http://localhost:8002`
const api = `${host}/api`
const artifact = `${api}/artifact`

const ARTIFACT = {
    GET: {
        SHARED_FILES_BY_ID: `${artifact}/get_shared_files_by_share_id`,
        ARTIFACT_FOR_APPROVAL: `${artifact}/get_artifacts_for_approval`,
        LATEST_UPLOAD: `${artifact}/get_latest_uploaded`,
        ARTIFACT_BY_NAME: `${artifact}/get_artifact_data_by_name`,
        BY_USERID_AND_KEY: `${artifact}/by_user_id_and_key`,
        AUDIO_TRANSCRIPT: `${artifact}/audio_transcript`,
        ADDITIONAL_PROPERTIES: `${artifact}/get_additional_properties`
    },
    POST: {
        UPLOAD: `${artifact}/`,
        UPLOAD_BOX_FILES: `${artifact}/upload_box_files`,
        UPLOAD_AWS_FILES: `${artifact}/upload_aws_files`,
        UPDATE_FILE: `${artifact}/update_file`,
        CREATE_TEMPLATE: `${artifact}/create_template`,
        UPDATE_TEMPLATE: `${artifact}/update_template`,
        UPDATE_TEMPLATE_DATA: `${artifact}/update_template_data`,
        CREATE_PROJECT: `${artifact}/create_project`,
        GET_ALL_ARTIFACTS_BY_TYPE: `${artifact}/get_all_artifacts_by_type`,
        SHARE_ARTIFACT: `${artifact}/share_artifact`,
        SET_VALIDATE: `${artifact}/set_validate`,
        SEND_ARTIFACT_FOR_APPROVAL: `${artifact}/send_artifact_for_approval`,
        UPDATE_ARTIFACT_APPROVAL_STATUS: `${artifact}/update_artifact_approval_status`,
        SHARE_WITH_WORKSPACE: `${artifact}/share_with_workspace`,
        DELETE_ARTIFACT: `${artifact}/delete_artifact`,
        DELETE_MULTIPLE_ARTIFACT: `${artifact}/delete_multiple_artifacts`,
        UPLOAD_TEMPLATE_GRAPH_SCHEMA: `${artifact}/upload_template_graph_schema`,
        ASSIGN_ARTIFACTS: `${artifact}/assign_artifacts`,
        UPDATE_NAME: `${artifact}/update_name`,
        UPDATE_ADDITIONAL_PROPERTIES: `${artifact}/update_additional_properties`,
        GET_ARTIFACTS_BY_IDS: `${artifact}/get_artifacts_by_ids`,
        PROJECT_FILES_NULL_FIELDS: `${artifact}/project_files_null_fields`,
        GET_XML_DATA: `${artifact}/get_xml_data`,
        ARTIFACT_GET_UPLOAD_SIGNED_URL: `${artifact}/get_upload_signed_url`,
        GET_FILE_KEY_PAIRS: `${artifact}/get_file_key_pairs`

    }
}

export default ARTIFACT