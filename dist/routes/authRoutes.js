"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/authRoutes.ts
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User")); // Import the User model
const catchAsync_1 = __importDefault(require("../utils/catchAsync")); // Import the catchAsync utility
const router = (0, express_1.Router)();
// POST /api/register - User registration endpoint
// Wrap the async handler with catchAsync to ensure proper error handling and type inference
router.post('/register', (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body; // Extract data from the request body
    // Basic validation
    if (!username || !email || !password) {
        // IMPORTANT: Add 'return' here to explicitly end the function execution after sending response
        return res.status(400).json({ message: 'Please enter all required fields: username, email, and password.' });
    }
    try {
        // Check if a user with the given email already exists
        let user = yield User_1.default.findOne({ email });
        if (user) {
            // IMPORTANT: Add 'return' here
            return res.status(400).json({ message: 'User with that email already exists.' });
        }
        // Check if a user with the given username already exists
        user = yield User_1.default.findOne({ username });
        if (user) {
            // IMPORTANT: Add 'return' here
            return res.status(400).json({ message: 'User with that username already exists.' });
        }
        // Create a new user instance
        user = new User_1.default({
            username,
            email,
            password // Mongoose pre-save hook will hash this password
        });
        // Save the new user to the database
        yield user.save();
        // Respond with success message (avoid sending password back)
        // IMPORTANT: Add 'return' here
        return res.status(201).json({ message: 'User registered successfully!', userId: user._id, username: user.username, email: user.email });
    }
    catch (error) {
        // Handle validation errors from Mongoose or other unexpected errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            // IMPORTANT: Add 'return' here
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        console.error('Registration error:', error);
        // IMPORTANT: Add 'return' here
        return res.status(500).json({ message: 'Server error during registration.' });
    }
})));
exports.default = router;
