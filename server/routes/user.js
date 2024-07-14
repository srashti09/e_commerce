const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Route to register a new user
router.post('/signup', async (req, res) => {
    const { name, phone, email, password, isAdmin } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email: email }, { phone: phone }] });
        if (existingUser) {
            return res.status(400).json({ error: true, msg: "User with this email or phone number already exists" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword,
            isAdmin: isAdmin || false // Ensure isAdmin defaults to false if not provided
        });

        // Generate JWT token
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: newUser,
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Failed to register user" });
    }
});

// Route to authenticate user
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }

        // Validate password
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: existingUser,
            token: token,
            msg: "User authenticated"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Failed to authenticate user" });
    }
});

// Route to update user password
router.put('/changePassword/:id', async (req, res) => {
    const { email, password, newPass } = req.body;
    const userId = req.params.id; // Capture the user ID from the request params

    try {
        // Find user by ID
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }

        // Validate current password
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Current password is incorrect" });
        }

        // Hash new password
        const hashNewPassword = await bcrypt.hash(newPass, 10);

        // Update user's password
        existingUser.password = hashNewPassword;
        const updatedUser = await existingUser.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Failed to update password" });
    }
});

// Route to fetch all users
router.get('/', async (req, res) => {
    try {
        const userList = await User.find();
        res.status(200).json(userList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Failed to fetch users" });
    }
});

// Route to fetch user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Failed to fetch user" });
    }
});

// Route to delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: true, msg: "User not found" });
        }
        res.status(200).json({ success: true, msg: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, msg: "Failed to delete user" });
    }
});

module.exports = router;
