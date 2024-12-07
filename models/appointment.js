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
            model: 'Users',
            key: 'id'
        }
    },
    professorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    availabilityId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Availabilities',
            key: 'id'
        }
    },
    appointmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: new Date().toISOString().split('T')[0] // Ensure future date
        }
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            isTime(value) {
                if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                    throw new Error('Invalid time format');
                }
            }
        }
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            isTime(value) {
                if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                    throw new Error('Invalid time format');
                }
            }
        }
    },
    status: {
        type: DataTypes.ENUM(
            'pending',
            'confirmed',
            'completed',
            'cancelled',
            'rescheduled'
        ),
        defaultValue: 'pending'
    },
    purpose: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: [0, 255]
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    // Validation to ensure end time is after start time
    validate: {
        checkTimeOrder() {
            if (this.startTime >= this.endTime) {
                throw new Error('End time must be after start time');
            }
        }
    },
    // Indexes for improved query performance
    indexes: [
        {
            fields: ['studentId', 'professorId', 'status', 'appointmentDate']
        }
    ]
});

module.exports = Appointment;