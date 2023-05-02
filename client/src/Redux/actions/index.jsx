import { loginUser, removeUser } from './authActions'
import { setArtifactData, setProjectArtifactsList, setProjectDataId, setDataQuality, removeProjectData, setTemplatesData, setProjectsList, setShareProjectsList, setBusinessFunctions, setAdditionalProperties, setRecentUploadedFiles, removeAllArtifacts, setProcessingFiles, setAllSubmissionsPagination, setAllDocumentsPagination } from './artifactActions'

const reduxActions = (dispatch) => (
    {
        loginUser: (u) => dispatch(loginUser(u)),
        setArtifactData: (e) => dispatch(setArtifactData(e)),
        setProjectArtifact: (e) => dispatch(setProjectArtifactsList(e)),
        setProjectDataId: (e) => dispatch(setProjectDataId(e)),
        setDataQuality: (e) => dispatch(setDataQuality(e)),
        setTemplatesData: (e) => dispatch(setTemplatesData(e)),
        setProjectsList: (e) => dispatch(setProjectsList(e)),
        setShareProjectsList: (e) => dispatch(setShareProjectsList(e)),
        setBusinessFunctions: (e) => dispatch(setBusinessFunctions(e)),
        setAdditionalProperties: (e) => dispatch(setAdditionalProperties(e)),
        setRecentUploadedFiles: (e) => dispatch(setRecentUploadedFiles(e)),
        setProcessingFiles: (e) => dispatch(setProcessingFiles(e)),
        removeUser: () => dispatch(removeUser()),
        removeAllArtifacts: () => dispatch(removeAllArtifacts()),
        removeProjectData: () => dispatch(removeProjectData()),
        setAllSubmissionsPagination: (e) => dispatch(setAllSubmissionsPagination(e)),
        setAllDocumentsPagination: (e) => dispatch(setAllDocumentsPagination(e))
    })

export default reduxActions