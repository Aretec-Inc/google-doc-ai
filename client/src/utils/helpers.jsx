import { message, notification } from 'antd'
import momentTz from 'moment-timezone'

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

const updateId = (id) => id?.replace(/[^0-9]/g, '')?.slice(0, 10)

const validateLength = (val, len = 15) => val.length > len ? `${val.slice(0, len)}...` : val

const templatePrefix = (id) => `000${id}`?.slice(-4,)

const disabledDate = (current) => {
    let customDate = momentTz().format('YYYY-MM-DD')
    return current && current > momentTz(customDate, 'YYYY-MM-DD')
}

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
    templatePrefix,
    updateId,
    validateLength,
    disabledDate
}