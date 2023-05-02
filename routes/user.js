const router = require('express').Router()
const jwt = require('jwt-simple')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')
const { runQuery } = require('virgin-helpers')
const { login, register, updateLoginTime } = require('../controllers/post')
const { contextOltp } = require('../config')
const secretKey = process.env?.secretKey
let minutes = process.env.NODE_ENV === 'production' ? 15 : 60
let secureMessage = { success: false, message: 'Session Expired!' }


router.post('/login', login)

router.post('/register', register)

router.post('/last_login', updateLoginTime)

router.use('*', async (req, res, next) => {

    if (process.env.NODE_ENV === 'production') {
        let { authorization } = req?.headers
        authorization = authorization?.split(' ')
        if (authorization) {
            // console.log("AUTH USER==>", authorization)
            try {
                // console.log("USER MIDDLE WARE==>")
                let decoded = jwt.decode(authorization[1], secretKey, true, 'HS512')
                if (decoded.exp >= moment().valueOf()) {
                    decoded.exp = moment().add(minutes, 'minutes').valueOf()
                    let token = jwt.encode(decoded, secretKey, 'HS512')
                    res.setHeader('accesstoken', token)
                    res.setHeader('Access-Control-Expose-Headers', '*')

                    addMessages(req?.body, decoded?.userId)
                    return next()
                }
                else {
                    return res.status(500).send(secureMessage)
                }
            }
            catch (e) {
                return res.status(500).send(secureMessage)
            }
        }
        else {
            return res.status(500).send(secureMessage)
        }
    }
    else {
        return next()
    }
})

const addMessages = async (body, userId) => {
    const { key_name, key_vale, file_id, application_type } = body
    let id = uuidv4()
    if (key_name && key_vale && file_id) {
        let sqlQuery = `INSERT INTO virgin_island.messages(id, message_type, case_id, user_id, message_status, message_time, notification_read) VALUES('${id}', '${key_name}', '${file_id}', '${userId}', '${key_vale}', NOW(), ${false})`

        await runQuery(contextOltp, sqlQuery)
    }
    else if (file_id && application_type) {
        let sqlQuery = `INSERT INTO virgin_island.messages(id, message_type, case_id, user_id, message_status, message_time, notification_read) VALUES('${id}', '${application_type}', '${file_id}', '${userId}', 'new applicant', NOW(), ${false})`

        await runQuery(contextOltp, sqlQuery)
    }
}

const updateCase = async () => {
    let sqlQuery = `SELECT * FROM virgin_island.documents`

    let result = [...new Array(150)]

    let promise = []

    let users = ['9d246f22-9b5c-4e7b-b632-74dec2fc5a47', 'd8be2e4c-d6ce-4700-9246-995ed2a44bc0']
    let priorities = ['High', 'Medium', 'Low']

    for (var v of result) {

        let file_id = uuidv4()

        let num = Math.round(Math.random() * 50) + 50

        let rand = Math.round(Math.random())

        let rand2 = Math.round(Math.random() * 2)

        let user = users[rand]

        let priority = priorities[rand2]

        sqlQuery = `INSERT INTO virgin_island.messages(id, message_type, case_id, user_id, message_status, message_time, notification_read) VALUES('${uuidv4()}', 'case_status', '${file_id}', '${user}', 'New', NOW() - interval '${num} hour', ${false})`

        promise.push(runQuery(contextOltp, sqlQuery))

        sqlQuery = `INSERT INTO virgin_island.messages(id, message_type, case_id, user_id, message_status, message_time, notification_read) VALUES('${uuidv4()}', 'priority', '${file_id}', '${user}', '${priority}', NOW() - interval '${num - 2} hour', ${false})`

        promise.push(runQuery(contextOltp, sqlQuery))

        num = num - (Math.round(Math.random() * 10))

        sqlQuery = `INSERT INTO virgin_island.messages(id, message_type, case_id, user_id, message_status, message_time, notification_read) VALUES('${uuidv4()}', 'case_status', '${file_id}', '${user}', 'Assigned', NOW() - interval '${num} hour', ${false})`

        promise.push(runQuery(contextOltp, sqlQuery))

        num = num - (Math.round(Math.random() * 10))

        sqlQuery = `INSERT INTO virgin_island.messages(id, message_type, case_id, user_id, message_status, message_time, notification_read) VALUES('${uuidv4()}', 'case_status', '${file_id}', '${user}', 'Pending Action', NOW() - interval '${num} hour', ${false})`

        promise.push(runQuery(contextOltp, sqlQuery))

        num = num - (Math.round(Math.random() * 10))

        sqlQuery = `INSERT INTO virgin_island.messages(id, message_type, case_id, user_id, message_status, message_time, notification_read) VALUES('${uuidv4()}', 'case_status', '${file_id}', '${user}', 'Awaiting Information', NOW() - interval '${num} hour', ${false})`

        promise.push(runQuery(contextOltp, sqlQuery))

        num = num - (Math.round(Math.random() * 10))

        sqlQuery = `INSERT INTO virgin_island.messages(id, message_type, case_id, user_id, message_status, message_time, notification_read) VALUES('${uuidv4()}', 'case_status', '${file_id}', '${user}', 'Approved', NOW() - interval '${num} hour', ${false})`

        promise.push(runQuery(contextOltp, sqlQuery))
    }

    await Promise.all(promise)
        .then(() => console.log('done****************'))
        .catch((e) => console.log('error****', e))
}

// updateCase()

module.exports = router