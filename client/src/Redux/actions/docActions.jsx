import { secureApi } from '../../Config/api'
import { GET } from '../../utils/apis'
import { callFinally } from '../../utils/helpers'
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

const getAllSubmissions = (body = {}, setLoading = null) => {
    return (dispatch) => {
        secureApi.post(GET?.ALL_SUBMISSIONS, body)
            .then((data) => {
                dispatch({
                    type: ALL_SUBMISSIONS,
                    allSubmissions: data?.allSubmissions,
                    totalSubmissions: data?.totalSubmissions
                })
            })
            .catch((e) => {
                dispatch({ type: ALL_SUBMISSIONS })
            })
            .finally(() => callFinally(setLoading))
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