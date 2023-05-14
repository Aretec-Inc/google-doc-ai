import axios from 'axios'

// import jwt_decode from 'jwt-decode'
import { errorMessage } from '../utils/helpers'

// const tokenDecode = (token) => {
//     token = token?.split('.')

//     token[1] = token[1]?.slice(5,)

//     token = token?.join('.')
//     return jwt_decode(token)
// }

const get = (url, params = {}) => {
    return axios.get(url, {
        ...params
    })
        .then((res) => {
            let token = res.data
            // const tokenData = tokenDecode(token)

            // if (tokenData?.isSessionExpied) {
            //     errorMessage(tokenData?.message)
            //     window.location.href = `${window.location.origin}/login`
            //     return
            // }

            return token
        })
        .catch((e) => e?.response?.data)
}

const post = (url, body = {}, params = {}) => {
    return axios.post(url, body, {
        ...params
    })
        .then((res) => {
            let token = res.data
            // const tokenData = tokenDecode(token)

            // if (tokenData?.isSessionExpied) {
            //     errorMessage(tokenData?.message)
            //     window.location.href = `${window.location.origin}/login`
            //     return
            // }

            return token
        })
        .catch((e) => {
            console.log('e', e)

            return e?.response?.data
        })
}

const secureApi = {
    get,
    post
}

const getPDF = (url, params = {}) => {

    // let token = localStorage.getItem('accessToken')
    // console.log('GET TOKEN FRONT END', token)
    return axios.get(url, {
        ...params,
        // headers: {
        //     'authorization': `Bearer ${token}`
        // }
    })
        .then((res) => {
            const { data, headers } = res
            // console.log('HEADER GET', headers['accesstoken'])
            // localStorage.setItem('accessToken', headers['accesstoken'])
            return data
        })
        .catch((e) => console.log('IM GET CONSOLE', e?.response?.data?.message == 'Session Expired!' ? localStorage.clear() : e?.response?.data?.message))
}

const postPDF = (url, body = {}) => {
    // let token = localStorage.getItem('accessToken')
    // console.log('POST TOKEN FRONT END', token)

    return axios.post(url, body, {
        // headers: {
        //     'authorization': `Bearer ${token}`
        // }
    })
        .then((res) => {
            const { data, headers } = res
            // console.log('HEADER POST', headers['accesstoken'])

            // localStorage.setItem('accessToken', headers['accesstoken'])
            return data
        })
        .catch((e) => console.log('IM POST CONSOLE', e?.response?.data?.message == 'Session Expired!' ? localStorage.clear() : e?.response?.data?.message))
}

const secureApiPDF = {
    getPDF,
    postPDF,
}

export {
    secureApi,
    secureApiPDF
}