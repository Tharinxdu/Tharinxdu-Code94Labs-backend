const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Function to sign a JWT token
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h', // token expires in 1 hour by default
    });
};

// Function to create and send the token in a cookie
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        httpOnly: true, // Cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
        sameSite: 'strict', // Helps to mitigate CSRF attacks
        maxAge: process.env.JWT_COOKIE_EXPIRES_IN || 3600000 // 1 hour in milliseconds
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        user
    });
};

// @desc    Sign up a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Create the new user
        const newUser = await User.create({
            username,
            email,
            password,
        });

        // Send the token in a cookie
        createSendToken(newUser, 201, res);
    } catch (error) {
        if (error.name === 'ValidationError') {
            // If it's a validation error, extract and send meaningful error messages
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ success: false, message: messages, errors: messages });
        }

        // Handle other potential errors
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


// @desc    Log in a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    try {
        // Check if the user exists & the password is correct
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }

        // Send the token in a cookie
        createSendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Log out a user (clear cookie)
// @route   GET /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 10 * 1000) // Cookie expires in 10 seconds
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
