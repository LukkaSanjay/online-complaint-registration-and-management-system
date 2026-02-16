const express = require('express');
const bcrypt = require('bcrypt'); // Used to encrypt passwords
const User = require('../models/User'); // Import the User model we just made

const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, userType } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Encrypt the password (Security)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Save the encrypted password, not the real one
            phone,
            userType
        });

        // 4. Save to Database
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Success! Send back the user info (excluding password)
        res.json({ 
            message: "Login successful", 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                userType: user.userType 
            } 
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// GET ALL AGENTS (For Admin to select)
router.get('/getAllAgents', async (req, res) => {
    try {
        const agents = await User.find({ userType: 'Agent' });
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;