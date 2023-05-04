import { ALL_PROCESSORS } from '../actions/types'

const reducer = (state = {}, action) => {
    switch (action.type) {
        case ALL_PROCESSORS: {
            return { ...state, allProcessors: action?.allProcessors }
        }
        default: {
            return state
        }
    }
}
export default reducer