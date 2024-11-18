const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', [
    check('username', 'Username is required').notEmpty(),
    check('mobile', 'Valid mobile number is required').isMobilePhone(),
    check('password', 'Password is required').notEmpty(),
    check('password', 'Password should be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, mobile, password } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ mobile });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        user = new User({
            username,
            mobile,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT token
        const payload = {
            user: { id: user._id }
        };
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login route
router.post('/login', [
    check('mobile', 'Valid mobile number is required').isMobilePhone(),
    check('password', 'Password is required').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { mobile, password } = req.body;

    try {
        // Check if the user exists
        let user = await User.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = {
            user: { id: user._id }
        };
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
