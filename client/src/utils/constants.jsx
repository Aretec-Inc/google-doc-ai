import HomeOutlined from '@ant-design/icons/HomeOutlined'
const manager = "manager"
const bgColor = '#0adc00'
const googleClientId = '1093943387531-sut2415eo36iv4capfstrunii744er9o.apps.googleusercontent.com'
const drawerRoutes = [
    {
        title: 'Home',
        icon: <HomeOutlined />
    }
]

const actions = {
    click: 'click',
    insert: 'insert',
    update: 'update',
    delete: 'delete',
    search: 'Navigation Bar Search',
    navigation: 'Navigation',
}

const actionTypes = {
    login: 'login',
    logout: 'logout',
    signup: 'Sign Up',
    upload: 'File Upload',
    addOrganization: 'New Organization Added',
    addGroup: 'New Group Added',
    addAgency: 'New Agency Added',
    addFolder: 'New Folder Added',
    deleteFolder: 'Folder Deleted',
    updateFolder: 'Folder Updated'
}

const actionTables = {
    none: 'none',
    user: 'users',
    artifact: 'artifact',
    organization: 'organizations',
    group: 'groups',
    agency: 'agencies',
    folder: 'folders'
}

const infoTypes = ["[ADVERTISING_ID]", "[AGE]", "[CREDIT_CARD_NUMBER]", "[CREDIT_CARD_TRACK_NUMBER]", "[DATE]", "[DATE_OF_BIRTH]", "[DOMAIN_NAME]", "[EMAIL_ADDRESS]", "[ETHNIC_GROUP]", "[FEMALE_NAME]", "[FIRST_NAME]", "[GENDER]", "[GENERIC_ID]", "[IBAN_CODE]", "[HTTP_COOKIE]", "[ICCID_NUMBER]", "[ICD9_CODE]", "[ICD10_CODE]", "[IMEI_HARDWARE_ID]", "[IMSI_ID]", "[IP_ADDRESS]", "[LAST_NAME]", "[LOCATION]", "[LOCATION_COORDINATES]", "[MAC_ADDRESS]", "[MAC_ADDRESS_LOCAL]", "[MALE_NAME]", "[MEDICAL_TERM]", "[ORGANIZATION_NAME]", "[PASSPORT]", "[PERSON_NAME]", "[PHONE_NUMBER]", "[STREET_ADDRESS]", "[SWIFT_CODE]", "[STORAGE_SIGNED_POLICY_DOCUMENT]", "[STORAGE_SIGNED_URL]", "[TIME]", "[URL]", "[VEHICLE_IDENTIFICATION_NUMBER]"]

export {
    bgColor,
    drawerRoutes,
    infoTypes,
    actions,
    actionTables,
    actionTypes,
    googleClientId,
    manager
}

