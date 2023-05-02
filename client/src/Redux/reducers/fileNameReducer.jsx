const reducer = (state = {}, action) => {
    switch (action.type) {
        case "FILE_NAME": {
            return { ...state, fileName: action.fileName }
        }
        default: {
            return state
        }
    }
}
export default reducer