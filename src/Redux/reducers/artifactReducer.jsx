import { ARTIFACT_DATA, REMOVE_ARTIFACT, REFRESH_ARTIFACT_LIST, ARTIFACT_LIST, RECENT_ARTIFACT, FOLDER_LIST, TABLE_VIEW, CURRENT_PROJECT, PROJECT_LIST, PROJECT_ARTIFACT_LIST, REMOVE_PROJECT, DATA_QUALITY, DATA_ID, IMAGE_DATA, SHARE_PROJECT_LIST, REMOVE_RECENT, TEMPLATES_DATA, BUSINESS_FUNCTION, PROPERTIES, RECENT_UPLOADED_FILES, REMOVE_ALL_ARTIFACTS, PROCESSING_FILES, ALL_SUBMISSIONS, ALL_DOCUMENTS } from '../types'

const reducer = (state = { artifactsList: [] }, action) => {
    let newArtifactsList = action?.artifactsList
    let oldArtifactLists = state?.artifactsList
    switch (action.type) {
        // case FOLDER_ARTIFACT_LIST: {
        //     return Object.assign({}, state, { folderArtifactsList: action.folderArtifactsList })
        // }
        case FOLDER_LIST: {
            return Object.assign({}, state, { folderList: action.folderList })
        }
        case ARTIFACT_DATA: {
            return Object.assign({}, state, { artifactData: action.artifactData })
        }
        case RECENT_ARTIFACT: {
            return Object.assign({}, state, { recentArtifact: action.recentArtifact })
        }
        case REMOVE_RECENT: {
            return Object.assign({}, state, { recentArtifact: [], artifactData: {} })
        }
        case REMOVE_ARTIFACT: {
            return { currentProject: state?.currentProject }
        }
        case REMOVE_PROJECT: {
            return Object.assign({}, state, { projectDataId: null, currentProject: null })
        }
        case ARTIFACT_LIST: {
            return Object.assign({}, state, { artifactsList: { ...oldArtifactLists ? oldArtifactLists : {}, ...newArtifactsList ? newArtifactsList : {} } })
        }
        case PROJECT_ARTIFACT_LIST: {
            return Object.assign({}, state, { projectArtifacts: action?.projectArtifacts })
        }
        case DATA_QUALITY: {
            return Object.assign({}, state, { dataQuality: action?.dataQuality })
        }
        case DATA_ID: {
            return Object.assign({}, state, { projectDataId: action?.projectDataId })
        }
        case REFRESH_ARTIFACT_LIST: {
            return Object.assign({}, state, { artifactsList: newArtifactsList })
        }
        case TABLE_VIEW: {
            return Object.assign({}, state, { isTableView: action.isTableView })
        }
        case CURRENT_PROJECT: {
            return Object.assign({}, state, { currentProject: action.currentProject, previousProject: action.currentProject })
        }
        case PROJECT_LIST: {
            return Object.assign({}, state, { projectsList: action.projectsList })
        }
        case SHARE_PROJECT_LIST: {
            return Object.assign({}, state, { sharedProjectsList: action.sharedProjectsList })
        }
        case IMAGE_DATA: {
            return Object.assign({}, state, { imageData: action.imageData })
        }
        case TEMPLATES_DATA: {
            return Object.assign({}, state, { templates: action.templates })
        }
        case BUSINESS_FUNCTION: {
            return Object.assign({}, state, { businessFunctions: action.businessFunctions })
        }
        case PROPERTIES: {
            return Object.assign({}, state, { properties: action.properties })
        }
        case RECENT_UPLOADED_FILES: {
            return Object.assign({}, state, { recentUploadedFiles: action.recentUploadedFiles })
        }
        case PROCESSING_FILES: {
            return Object.assign({}, state, { processingFiles: action.processingFiles })
        }
        case REMOVE_ALL_ARTIFACTS: {
            return { projectsList: state?.projectsList, sharedProjectsList: state?.sharedProjectsList }
        }
        case ALL_SUBMISSIONS: {
            return Object.assign({}, state, { allSubmitions: action.allSubmitions })
        }
        case ALL_DOCUMENTS: {
            return Object.assign({}, state, { allDocuments: action.allDocuments })
        }
        default: {
            return state
        }
    }
}

export default reducer