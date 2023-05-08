import { ALL_PROCESSORS, ALL_SUBMISSIONS } from '../actions/types'

const reducer = (state = {}, action) => {
    switch (action.type) {
        case ALL_PROCESSORS: {
            return { ...state, allProcessors: action?.allProcessors }
        }
        case ALL_SUBMISSIONS: {
            return { ...state, allSubmissions: action?.allSubmissions }
        }
        default: {
            return state
        }
    }
}

export default reducer