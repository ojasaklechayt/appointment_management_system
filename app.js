const express = require('express');
const { sequelize, testDatabaseConnection } = require('./config/database');
const setupAssociations = require('./models/associations');
require('dotenv').config();
const app = express();

async function startServer() {
    try {
        await testDatabaseConnection();
        setupAssociations();
        await sequelize.sync();

        const PORT = proces.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running or port ${PORT}`);
        })
    } catch (error) {
        console.error('Failed to start server', error);
    }
}

startServer();

module.exports = app;