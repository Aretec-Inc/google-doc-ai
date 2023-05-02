import axios from 'axios'

const get = (url, params = {}) => {

    let token = localStorage.getItem('accessToken')
    // console.log("GET TOKEN FRONT END", token)
    return axios.get(url, {
        ...params,
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            const { data, headers } = res
            // console.log("HEADER GET", headers['accesstoken'])
            localStorage.setItem('accessToken', headers['accesstoken'])
            return res
        })
        .catch((e) => console.log("IM GET CONSOLE", e?.response?.data?.message == "Session Expired!" ? localStorage.clear() : e?.response?.data?.message))
}

const post = (url, body = {}) => {
    let token = localStorage.getItem('accessToken')
    // console.log("POST TOKEN FRONT END", token)

    return axios.post(url, body, {
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
        .then((res) => {
            const { data, headers } = res
            // console.log("HEADER POST", headers['accesstoken'])

            localStorage.setItem('accessToken', headers['accesstoken'])
            return res
        })
        .catch((e) => console.log("IM POST CONSOLE", e?.response?.data?.message == "Session Expired!" ? localStorage.clear() : e?.response?.data?.message))
}
const getPDF = (url, params = {}) => {

    // let token = localStorage.getItem('accessToken')
    // console.log("GET TOKEN FRONT END", token)
    return axios.get(url, {
        ...params,
        // headers: {
        //     'authorization': `Bearer ${token}`
        // }
    })
        .then((res) => {
            const { data, headers } = res
            // console.log("HEADER GET", headers['accesstoken'])
            // localStorage.setItem('accessToken', headers['accesstoken'])
            return data
        })
        .catch((e) => console.log("IM GET CONSOLE", e?.response?.data?.message == "Session Expired!" ? localStorage.clear() : e?.response?.data?.message))
}

const postPDF = (url, body = {}) => {
    // let token = localStorage.getItem('accessToken')
    // console.log("POST TOKEN FRONT END", token)

    return axios.post(url, body, {
        // headers: {
        //     'authorization': `Bearer ${token}`
        // }
    })
        .then((res) => {
            const { data, headers } = res
            // console.log("HEADER POST", headers['accesstoken'])

            // localStorage.setItem('accessToken', headers['accesstoken'])
            return data
        })
        .catch((e) => console.log("IM POST CONSOLE", e?.response?.data?.message == "Session Expired!" ? localStorage.clear() : e?.response?.data?.message))
}

const secureApi = {
    get,
    post,
}
const secureApiPDF = {
    getPDF,
    postPDF,
}

export {
    secureApi,
    secureApiPDF
}