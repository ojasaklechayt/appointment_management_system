const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;

// Generate access token
const generateAccessToken = (user) => {
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
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        JWT_SECRET,
        {
            expiresIn: '7d'
        }
    );
};

// Verify access token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Access Token Verification Error:', error.message);

        // Handle specific error cases
        if (error.name === 'TokenExpiredError') {
            return { error: 'Access token has expired' };
        }
        if (error.name === 'JsonWebTokenError') {
            return { error: 'Invalid access token' };
        }

        // General error fallback
        return { error: 'Failed to verify access token' };
    }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Refresh Token Verification Error:', error.message);

        // Handle specific error cases
        if (error.name === 'TokenExpiredError') {
            return { error: 'Refresh token has expired' };
        }
        if (error.name === 'JsonWebTokenError') {
            return { error: 'Invalid refresh token' };
        }

        // General error fallback
        return { error: 'Failed to verify refresh token' };
    }
};

// Exporting methods individually for better efficiency
module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};
