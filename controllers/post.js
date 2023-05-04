
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
var jwt = require('jwt-simple')
const moment = require('moment')
const { runQuery, apiResponse, successFalse } = require('virgin-helpers')
const { contextOltp, service_key, languageClient, storage, dlpClient, projectId } = require('../config')

let minutes = process.env.NODE_ENV === 'production' ? 15 : 60

// const secretKey = 'access_token'
const secretKey = process.env?.secretKey

const login = (req, res) => {
    try {
        const { email, password } = req.body

        let sqlQuery = `SELECT user_id,password, name, email, auth_type, role, is_deleted, created_at, updated_at, last_login, curr_login FROM virgin_island.users WHERE email='${email}' AND auth_type='web' and is_deleted is not true`

        // Run the query
        runQuery(contextOltp, sqlQuery)
            .then(async (row) => {
                console.log('SQL QUERY ROW', row)
                if (!row?.length) {
                    return successFalse(res, 'Try To Sigin Google With This Email or Your Account is Not Ready Yet !', 500)
                }
                // else if (row[0]?.resp) {
                //     return successFalse(res, 'This Email Is Not Valid or Your Account is Not Verified Yet !', 404)
                // }
                // If there is a user with the given email, but the password the user gives us is incorrect
                else if (!await bcrypt.compare(password, row[0]?.password)) {
                    return successFalse(res, 'Password is Incorrect!', 500)
                }
                else {
                    let sqlQuery = `SELECT user_id, name, email, auth_type, role, created_at, updated_at, TO_CHAR(last_login,'Mon dd, yyyy hh12:mi AM') as last_login_date FROM virgin_island.users WHERE email='${email}'`

                    const userRow = await runQuery(contextOltp, sqlQuery)
                    console.log('userRow ==>', userRow)
                    let dbUser = userRow?.[0]
                    let token = await jwt.encode({
                        userId: dbUser?.user_id,
                        exp: moment().add(minutes, 'minutes').valueOf()
                    }, secretKey)
                    console.log("TOKEN ===>", token)
                    res.setHeader('accesstoken', token)
                    dbUser.access_token = token
                    let obj = {
                        success: true,
                        userData: dbUser,
                        message: 'Successfully Logged In!'
                    }
                    return apiResponse(res, 201, obj)
                }
            })
            .catch((e) => {
                console.log('e', e)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message)
    }
}
const registerSecret = 'verify'


const register = (req, res) => {
    try {
        const { name, email, password } = req?.body

        const id = uuidv4()
        if (!email) {
            return successFalse(res, 'Email Cannot Be Empty!', 402)
        }

        let sqlQuery = `SELECT * FROM virgin_island.users WHERE email='${email}'`
        let token, hashPassword

        // Run the query
        runQuery(contextOltp, sqlQuery)
            .then(async (row) => {
                if (row?.length > 0) {
                    return successFalse(res, 'User Already Exist With This Email, Please Login through Email and Password!', 406)
                }
                else {
                    hashPassword = await bcrypt.hash(password, 10)
                    token = jwt.encode({
                        user_id: id,
                        email: email,
                        exp: moment().add(1, 'day').valueOf()
                    }, registerSecret)

                    sqlQuery = `INSERT INTO virgin_island.users(user_id, name, email, password, auth_type, created_at, updated_at, role) VALUES ('${id}', '${name}', '${email}', '${hashPassword}', 'web',  NOW(), NOW(), 'applicant')`
                    req.body.token = token
                    console.log(token)
                    runQuery(contextOltp, sqlQuery)
                        .then(async () => {
                            let obj = {
                                success: true,
                                message: 'Registration Completed Successfully!'
                            }
                            // emailText(req.body)
                            return apiResponse(res, 200, obj)

                        })
                        .catch((e) => {
                            console.log('e', e)
                            return successFalse(res, e?.message)
                        })
                }
            })
            .catch((e) => {
                console.log('e', e)
                return successFalse(res, e?.message)
            })
    }
    catch (e) {
        console.log('e', e)
        return successFalse(res, e?.message)
    }
}

module.exports = {
    login,
    register
}