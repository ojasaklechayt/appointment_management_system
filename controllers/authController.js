const { User } = require('../models');
const {
    generateAccessToken,
    generateRefreshToken
} = require('../config/jwt');
const { Op } = require('sequelize');

const validateRegistrationInput = (username, email, password, role, firstName, lastName) => {
    const errors = {};

    if (!firstName || firstName.trim().length === 0) {
        errors.firstName = 'First name cannot be empty';
    }

    if (!lastName || lastName.trim().length === 0) {
        errors.lastName = 'Last name cannot be empty';
    }

    if (!username || username.length < 3) {
        errors.username = 'Username must be at least 3 characters long and cannot be empty';
    }

    if (!email || !/^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
        errors.email = 'Invalid email address';
    }

    if (!password || password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    if (!['student', 'professor', 'admin'].includes(role)) {
        errors.role = 'Invalid user role';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

exports.register = async (req, res) => {
    try {

        const { firstName, lastName, username, email, password, role } = req.body;
        const { isValid, errors } = validateRegistrationInput(username, email, password, role, firstName, lastName);

        if (isValid === false) {
            console.log(errors);
            return res.status(400).json({ errors: errors });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'A user with this username or email already exists.'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            firstName,
            lastName,
            role,
            isActive: true,
            lastLogin: new Date()
        });

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Prepare user response
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };

        res.status(201).json({
            user: userResponse,
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Registration failed',
            details: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        console.log(req.body)

        const { email, password } = req.body;

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                error: 'Invalid login credentials'
            });
        };

        if (!user.isActive) {
            return res.status(403).json({
                error: 'User account is not active'
            });
        }

        user.lastLogin = new Date();
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        res.set('Authorization', `Bearer ${accessToken}`);
        res.set('Refresh-Token', refreshToken);
        console.log(userResponse);

        res.json({
            user: userResponse,
            accessToken,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({
            error: 'Login failed',
            details: error.message
        });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({
                error: 'Invalid or expired refresh token'
            });
        }

        // Find user
        const user = await User.findOne({
            where: {
                id: decoded.id
            }
        });
        
        if (!user) {
            return res.status(401).json({
                error: 'User not found'
            });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(500).json({
            error: 'Token refresh failed',
            details: error.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.json({
            message: 'Logout successful'
        });
    } catch (error) {
        res.status(500).json({
            error: 'Logout failed',
            details: error.message
        });
    }
};
