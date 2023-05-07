import { message, notification } from 'antd'
const requiredMessage = (value) => `Please input your ${value}!`

const inputPlace = (value) => `Input your ${value} Here...!`

const successMessage = (desc = 'Successfully Complete!') => {
    return message.success(desc)
}

const infoMessage = (desc = 'Successfully Complete!') => {
    return message.info(desc)
}

const errorMessage = (desc = 'Oops Something Went Wrong!') => {
    return message.error(desc)
}

const warningMessage = (desc = 'Warning!') => {
    return message.warning(desc)
}

const successNotification = (message = 'Successfully Complete!') => {
    return notification.success({ message })
}

const errorNotification = (message = 'Oops Something Went Wrong!') => {
    return notification.error({ message })
}

const convertTitle = (val) => {
    val = String(val)
    return val.charAt(0).toUpperCase() + val.slice(1)
}

const stringLimiter = (val, limit = 50) => val?.length > limit ? `${val.slice(0, limit)}...` : val

const userObject = (result) => {
    const { profileObj } = result
    return {
        email: profileObj.email,
        social_id: profileObj.googleId,
        first_name: profileObj.givenName,
        last_name: profileObj.familyName
    }
}
const googleLogin = async (result, history, loginUser, dispatch) => {
    const obj = userObject(result)
    // return axios.post(ACCOUNT_CHECK_SOCIAL_PARAMS, obj)
    //     .then((res) => {
    //         const { data } = res
    //         localStorage.setItem('accesstoken', data?.data?.access_token)
    //         if (data?.success) {
    //             dispatch(loginUser(data?.data))
    //             successMessage(data?.message || 'Successfully Logged In!')
    //             eventTrigger(actions.click, actionTypes.login, actionTables.user, data?.data?.id)
    //             return setTimeout(() => {
    //                 history.push('/')
    //             }, 300)
    //         }
    //         else if (data?.pending) {
    //             warningMessage(data?.message)
    //         }
    //         else {
    //             errorMessage(data?.message)
    //         }
    //         return false
    //     }).catch((err) => {
    //         let erMsg = err?.response?.data?.message;
    //         erMsg && errorMessage(erMsg);
    //         console.log("google login error", err)
    //     })
}

const updateId = (id) => id?.replace(/[^0-9]/g, '')?.slice(0, 10)

const validateLength = (val, len = 15) => val.length > len ? `${val.slice(0, len)}...` : val

export {
    requiredMessage,
    inputPlace,
    successMessage,
    infoMessage,
    errorMessage,
    warningMessage,
    successNotification,
    errorNotification,
    convertTitle,
    stringLimiter,
    googleLogin,
    updateId,
    validateLength
}