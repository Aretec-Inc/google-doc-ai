import { secureApi } from '../../Config/api'
import { GET } from '../../utils/apis'
import { ALL_PROCESSORS } from './types'

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

export {
    getAllProcessors
}