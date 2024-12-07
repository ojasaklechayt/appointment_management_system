const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'User',
            key: id
        },
    },
    professorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'User',
            key: id
        }
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    status: {
        type: DataTypes.ENUM('pendind','confirmed','cancelled'),
        defaultValue: 'pending'
    }
}, {
    indexes: [
        {
            fields: ['studentId','professorId','status']
        }
    ]
});

module.exports = Appointment;