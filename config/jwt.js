const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

module.exports = {
    // Generate access token
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRATION || '1h'
            }
        );
    },

    // Generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id
            },
            JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );
    },

    // Verify access token
    verifyAccessToken: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    },

    // Verify refresh token
    verifyRefreshToken: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
};