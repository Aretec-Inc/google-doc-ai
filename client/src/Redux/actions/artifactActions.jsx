import { ARTIFACT_DATA, REMOVE_ARTIFACT, ARTIFACT_LIST, REFRESH_ARTIFACT_LIST, RECENT_ARTIFACT, FOLDER_LIST, FOLDER_ARTIFACT_LIST, TABLE_VIEW, PROJECT_LIST, CURRENT_PROJECT, PROJECT_ARTIFACT_LIST, REMOVE_PROJECT, DATA_QUALITY, DATA_ID, IMAGE_DATA, SHARE_PROJECT_LIST, REMOVE_RECENT, TEMPLATES_DATA, BUSINESS_FUNCTION, PROPERTIES, RECENT_UPLOADED_FILES, REMOVE_ALL_ARTIFACTS, PROCESSING_FILES, ALL_SUBMISSIONS, ALL_DOCUMENTS } from '../types'

const setArtifactData = (artifactData) => {
    return {
        type: ARTIFACT_DATA,
        artifactData
    }
}

const setRecentArtifact = (recentArtifact) => {
    return {
        type: RECENT_ARTIFACT,
        recentArtifact
    }
}

const removeRecentArtifact = () => {
    return {
        type: REMOVE_RECENT
    }
}

const removeArtifactData = () => {
    return {
        type: REMOVE_ARTIFACT
    }
}

const removeProjectData = () => {
    return {
        type: REMOVE_PROJECT
    }
}

export const setArtifactsList = (array, isRefresh = false) => (
    {
        type: isRefresh ? REFRESH_ARTIFACT_LIST : ARTIFACT_LIST,
        artifactsList: array
    }
)

export const setProjectArtifactsList = (projectArtifacts) => (
    {
        type: PROJECT_ARTIFACT_LIST,
        projectArtifacts
    }
)

export const setDataQuality = (dataQuality) => (
    {
        type: DATA_QUALITY,
        dataQuality
    }
)

export const setProjectDataId = (projectDataId) => (
    {
        type: DATA_ID,
        projectDataId
    }
)

export const setFolderList = (array) => (
    {
        type: FOLDER_LIST,
        folderList: array
    }
)

export const setProjectsList = (array) => (
    {
        type: PROJECT_LIST,
        projectsList: array
    }
)

export const setShareProjectsList = (array) => (
    {
        type: SHARE_PROJECT_LIST,
        sharedProjectsList: array
    }
)

export const setFolderArtifactsList = (array) => (
    {
        type: FOLDER_ARTIFACT_LIST,
        folderArtifactsList: array
    }
)

const setIsTableView = (isTableView) => {
    return {
        type: TABLE_VIEW,
        isTableView
    }
}

export const setCurrentProject = (project) => (
    {
        type: CURRENT_PROJECT,
        currentProject: project
    }
)

export const setImageData = (imageData) => (
    {
        type: IMAGE_DATA,
        imageData
    }
)

export const setTemplatesData = (templates) => (
    {
        type: TEMPLATES_DATA,
        templates
    }
)

export const setBusinessFunctions = (businessFunctions) => (
    {
        type: BUSINESS_FUNCTION,
        businessFunctions
    }
)

export const setAdditionalProperties = (properties) => (
    {
        type: PROPERTIES,
        properties
    }
)

export const setRecentUploadedFiles = (recentUploadedFiles) => (
    {
        type: RECENT_UPLOADED_FILES,
        recentUploadedFiles
    }
)

export const setProcessingFiles = (processingFiles) => (
    {
        type: PROCESSING_FILES,
        processingFiles
    }
)

export const removeAllArtifacts = () => (
    {
        type: REMOVE_ALL_ARTIFACTS
    }
)

export const setAllSubmissionsPagination = (allSubmitions) => {
    return {
        type: ALL_SUBMISSIONS,
        allSubmitions
    }
}

export const setAllDocumentsPagination = (allDocuments) => {
    return {
        type: ALL_DOCUMENTS,
        allDocuments
    }
}

export {
    setArtifactData,
    removeArtifactData,
    setRecentArtifact,
    setIsTableView,
    removeProjectData,
    removeRecentArtifact
}