const host = `https://context-api-2my7afm7yq-ue.a.run.app`
// const host = `https://backend.neptunestech.com`
// const gcpHost = `http://localhost:8080`
// const awsHost = `http://localhost:8082`
// const host = cloud === 'aws' ? awsHost : gcpHost
const api = `${host}/api`

const accounts_api = `${api}/accounts`
const accounts_org_api = `${accounts_api}/organization`
const accounts_group_api = `${accounts_api}/group`

const ACCOUNTS_APIS = {
    POST: {
        // ACCOUNTS
        ACCOUNT_REGISTRATION: `${accounts_api}/register`,
        ACCOUNT_LOGIN: `${accounts_api}/login`,
        ACCOUNT_FORGOT_PASSWORD: `${accounts_api}/forgot_password`,
        ACCOUNT_UPDATE_PASSWORD: `${accounts_api}/update_password`,
        ACCOUNT_CHECK_SOCIAL_PARAMS: `${accounts_api}/check_social_params`,
        ACCOUNT_UPDATE_ROLE: `${accounts_api}/update_role_by_user_id`,
        ACCOUNT_UPDATE_APPROVESTATUS: `${accounts_api}/update_approvestatus_by_user_id`,
        ACCOUNT_UPDATE_PENDINGSTATUS: `${accounts_api}/update_pendingstatus_by_user_id`,
        ACCOUNT_UPDATE_BLOCKSTATUS_BY_USER_ID: `${accounts_api}/update_blockstatus_by_user_id`,
        ACCOUNT_UPDATE_USER: `${accounts_api}/update_user`,
        ACCOUNT_DELETE_USER_BY_EMAIL: `${accounts_api}/delete_user_by_email`,
        ACCOUNT_UPDATE_TOKEN: `${accounts_api}/update_token`,
        ACCOUNT_CHANGE_PASSWORD: `${accounts_api}/change_password`,
        ACCOUNT_UPDATE_PICTURE: `${accounts_api}/update_picture`,

        // ACCOUNT ORGANIZATION
        ADD_ORGANIZATION: `${accounts_org_api}/add_organization`,
        JOIN_ORGANIZATION: `${accounts_org_api}/join_organization`,

        // GROUP
        ADD_GROUP: `${accounts_group_api}/add_group`
    },
    GET: {
        // ACCOUNT ORGANIZATION
        GET_ALL_ORGANIZATIONS: `${accounts_org_api}/get_all_organizations`,

        // GROUP
        ACCOUNTS_GET_ALL_GROUPS: `${accounts_group_api}/get_all_groups`,

        // ACCOUNTS
        ACCOUNT_GET_USER: `${accounts_api}/get_user`,
        ACCOUNT_VERIFY_TOKEN: `${accounts_api}/verifytoken`,
        ACCOUNT_VERIFY_EMAIL: `${accounts_api}/verifyEmail`,
        ACCOUNT_NUM_OF_USER_TYPES: `${accounts_api}/num_of_user_types`,
        ACCOUNT_NUM_OF_NEW_USERS: `${accounts_api}/num_of_new_users`,
        ACCOUNT_APPROVE_USERS: `${accounts_api}/approve_users`,
        ACCOUNT_NEW_USERS: `${accounts_api}/new_users`,
        ACCOUNT_BLOCK_USERS: `${accounts_api}/block_users`,
        ACCOUNT_PENDING_USERS: `${accounts_api}/pending_users`,
        ACCOUNT_NON_VERIFIED_USERS: `${accounts_api}/non_verified_users`,
        ACCOUNT_GET_USER_ORGANIZATION_AND_GROUPS: `${accounts_api}/get_user_organization_and_groups`,
        ACCOUNT_GET_ALL: `${accounts_api}/get_all`,
        ACCOUNT: accounts_api
    }
}

export default ACCOUNTS_APIS