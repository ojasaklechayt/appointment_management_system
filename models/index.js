'use strict';
const { sequelize: configSequelize } = require('../config/database');
const Sequelize = require('sequelize');

// Directly import your models
const User = require('./users');
const Appointment = require('./appointment');
const Availability = require('./availability');

const db = {};

// Add models to the db object
db.User = User;
db.Appointment = Appointment;
db.Availability = Availability;

db.sequelize = configSequelize;
db.Sequelize = Sequelize;

module.exports = db;