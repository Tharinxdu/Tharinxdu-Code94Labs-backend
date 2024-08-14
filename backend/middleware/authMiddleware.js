const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
    let token;

    // 1) Check if the token exists in the Authorization header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Get token from Bearer header
    } else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt; // Get token from cookies
    }

    if (!token || token === 'loggedout') {
        return res.status(401).json({ success: false, message: 'You are not logged in! Please log in to get access.' });
    }

    try {
        // 2) Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'The user belonging to this token does no longer exist.' });
        }

        // 4) Grant access to protected route
        req.user = currentUser;
        next();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
