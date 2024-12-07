const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Availability = sequelize.define('Availability', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    professorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    day: {
        type: DataTypes.ENUM(
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ),
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
            isTime(value) {
                // Custom validation to ensure valid time format
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
                // Custom validation to ensure valid time format
                if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                    throw new Error('Invalid time format');
                }
            }
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    maxAppointments: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        validate: {
            min: 1,
            max: 10
        }
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
            fields: ['professorId', 'day', 'startTime', 'endTime']
        }
    ]
});

module.exports = Availability;