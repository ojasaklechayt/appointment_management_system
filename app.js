const express = require('express');
const { sequelize, testDatabaseConnection } = require('./config/database');
const setupAssociations = require('./models/associations');
const db = require('./models');
const { Appointment, User, Availability } = db;
const authRoutes = require('./routes/authRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoute');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        error: 'Something went wrong',
        message: err.message
    });
});

async function startServer() {
    try {
        await testDatabaseConnection();
        setupAssociations(); // Call associations setup here
        await sequelize.sync({ alter: true }); // Use alter to modify existing tables
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server', error);
    }
}

startServer();

module.exports = app;