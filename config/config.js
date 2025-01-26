module.exports = {
    development: {
        username: 'postgres',
        password: 'M<2ZUQhV8-z^YKt}0OYcBvZ)%.j6N*',
        database: 'postgres',
        host: 'localhost',
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