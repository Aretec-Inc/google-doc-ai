import { ALL_PROCESSORS, ALL_SUBMISSIONS, DOCUMENTS } from '../actions/types'

const reducer = (state = {}, action) => {
    switch (action.type) {
        case ALL_PROCESSORS: {
            return { ...state, allProcessors: action?.allProcessors }
        }
        case ALL_SUBMISSIONS: {
            return { ...state, allSubmissions: action?.allSubmissions }
        }
        case DOCUMENTS: {
            return { ...state, allDocuments: { ...state?.allDocuments, ...action?.documents } }
        }
        default: {
            return state
        }
    }
}

export default reducer