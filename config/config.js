module.exports = {
    development: {
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        host: 'localhost',
        dialect: 'postgres',
        port: 5432
    },
    cloudDB: {
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        // host: 'context-oltp.cmu904sgeqoe.us-east-1.rds.amazonaws.com',
        host: '35.185.46.62',
        dialect: 'postgres',
        port: 5432
    },
    production: {
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        host: process.env.HOST,
        dialect: 'postgres',
        port: 5432
    }
}