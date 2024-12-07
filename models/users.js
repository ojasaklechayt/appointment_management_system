const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: [2, 50],
            notEmpty: true
        }
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: [2, 50],
            notEmpty: true
        }
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        validate: {
            len: [3, 50],
            isAlphanumeric: true
        }
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 255]
        }
    },
    role: {
        type: DataTypes.ENUM('student', 'professor', 'admin'),
        allowNull: false
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    contactNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: /^[+]?[\d\s-]{10,20}$/
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // Hooks for password hashing and other operations
    hooks: {
        beforeCreate: async (user) => {
            // Hash password before creation
            user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user) => {
            // Hash password if modified
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    },
    // Additional model options
    indexes: [
        { fields: ['email'] },
        { fields: ['username'] },
        { fields: ['role'] }
    ]
});

// Class method for password comparison
User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;