const { User } = require('../models/users');
const { verifyAccessToken } = require('../config/jwt');

const authMiddleware = async (req, res, next) => {
    try {
        // Check for Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                error: 'No authentication token, authorization denied.'
            });
        }

        // Verify token format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({
                error: 'Token format is invalid.'
            });
        }

        const token = parts[1];

        // Verify token
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            return res.status(401).json({
                error: 'Token is invalid or expired.'
            });
        }

        // Find user
        const user = await User.findByPk(decoded.id, {
            attributes: {
                exclude: ['password']
            }
        });

        if (!user) {
            return res.status(401).json({
                error: 'User not found.'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                error: 'User account is not active.'
            });
        }

        // Attach user and token to request
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).json({
            error: 'Authentication failed.',
            details: error.message
        });
    }
};

// Role-based authorization middleware
const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Access denied. Insufficient permissions.'
            });
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    roleMiddleware
};