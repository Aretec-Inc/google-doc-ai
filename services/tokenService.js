const jwt = require('jsonwebtoken')
const moment = require('moment')

let minutes = process.env.NODE_ENV === 'production' ? 15 : 60
const accessTokenSecret = process?.env?.ACCESS_TOKEN

const generateToken = (payload) => jwt.sign({ ...payload, exp: moment()?.add(minutes, 'minutes')?.valueOf() }, accessTokenSecret)

const generateBodyResponse = (payload, res) => {
    // let token = jwt.sign(payload, accessTokenSecret)

    // token = token?.split('.')

    // token[1] = `${token[2]?.slice(5, 10)}${token[1]}`

    // return res?.send(token?.join('.'))

    return res?.send(payload)
}

const verifyToken = (token) => jwt.verify(token, accessTokenSecret)

module.exports = {
    generateToken,
    generateBodyResponse,
    verifyToken
}