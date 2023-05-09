import { secureApi } from '../../Config/api'
import { GET } from '../../utils/apis'
import { ALL_PROCESSORS, ALL_SUBMISSIONS, DOCUMENTS } from './types'

const getAllProcessors = () => {
    return (dispatch) => {
        secureApi.get(GET?.ALL_PROCESSORS)
            .then((data) => {
                dispatch({
                    type: ALL_PROCESSORS,
                    allProcessors: data?.allProcessors || []
                })
            })
            .catch((e) => {
                dispatch({ type: ALL_PROCESSORS, allProcessors: [] })
            })
    }
}

const getAllSubmissions = () => {
    return (dispatch) => {
        secureApi.get(GET?.ALL_SUBMISSIONS)
            .then((data) => {
                dispatch({
                    type: ALL_SUBMISSIONS,
                    allSubmissions: data?.allSubmissions || []
                })
            })
            .catch((e) => {
                dispatch({ type: ALL_SUBMISSIONS, allSubmissions: [] })
            })
    }
}

const setDocuments = (documents) => {
    return {
        type: DOCUMENTS,
        documents
    }
}

export {
    getAllProcessors,
    getAllSubmissions,
    setDocuments
}