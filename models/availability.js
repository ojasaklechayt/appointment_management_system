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
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
            isAfter: this.startTime
        }
    }
},
    {
        indexes: [
            {
                fields: ['professorId', 'startTime', 'endTime']
            }
        ]
    }
);

module.exports = Availability;