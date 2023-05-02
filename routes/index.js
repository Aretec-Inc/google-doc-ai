const express = require('express')
const jwt = require('jwt-simple')
const moment = require('moment')
const router = express.Router()
const secretKey = process.env?.secretKey
let minutes = process.env.NODE_ENV === 'production' ? 15 : 60
let secureMessage = { success: false, message: 'Session Expired!' }
const middleware = (req, res, next) => {
    // console.log("INDEX URL ===>", req?.url)
    // router.use('*', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        let { authorization } = req?.headers

        authorization = authorization?.split(' ')
        if (authorization) {
            // console.log("AUTH INDEX==>", authorization)
            try {
                // console.log("INDEX MIDDLE WARE==>")

                let decoded = jwt.decode(authorization[1], secretKey, true, 'HS512')
                if (decoded.exp >= moment().valueOf()) {
                    decoded.exp = moment().add(minutes, 'minutes').valueOf()
                    let token = jwt.encode(decoded, secretKey, 'HS512')
                    res.setHeader('accesstoken', token)
                    res.setHeader('Access-Control-Expose-Headers', '*')
                    return next()
                }
                else {
                    return res.send(secureMessage)
                }
            }
            catch (e) {
                return res.send(secureMessage)
            }
        }
        else {
            return res.send(secureMessage)
        }
    }
    else {
        return next()
    }
}

router.use('/virgin_island', require('./user'))

router.use('/virgin_island', require('./get'))

router.use('/virgin_island', require('./post'))



module.exports = router