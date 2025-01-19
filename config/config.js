module.exports = {
    development: {
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        host: 'test',
        dialect: 'postgres',
        port: 5432
    },
    cloudDB: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres',
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: 5432
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres',
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: 5432
    }
}