const express = require('express');
const { sequelize, testDatabaseConnection } = require('./config/database');
const setupAssociations = require('./models/associations');
const { Appointment } = require('../models/appointment');
const { User } = require('../models/users');
const { Availability } = require('../models/availability');
const authRoutes = require('./routes/authRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use((err, req, res, next) => {
    console.err(err.stack);
    res.status(500).send({
        error: 'Something went wrong',
        message: err.message
    });
});

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