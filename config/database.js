const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : 'false',
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        }
    }
);

async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Postgres SQL Established');
        console.log(`Connected to postgres: ${process.env.DB_NAME}`)
    } catch (error) {
        console.error('Unablet to connect to database', error);
        process.exit(1);
    }
}


module.exports = {
    sequelize,
    testDatabaseConnection
};

