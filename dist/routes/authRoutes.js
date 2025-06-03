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
const express_1 = require("express"); // ADD NextFunction here
const User_1 = __importDefault(require("../models/User")); // Import the User model
const catchAsync_1 = __importDefault(require("../utils/catchAsync")); // Import the catchAsync utility
const bcrypt_1 = __importDefault(require("bcrypt")); // Import bcrypt for password comparison
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import jsonwebtoken for JWT generation
const router = (0, express_1.Router)();
// --- POST /api/register - User registration endpoint ---
router.post('/register', (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all required fields: username, email, and password.' });
    }
    try {
        // Check if a user with the given email already exists
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with that email already exists.' });
        }
        // Check if a user with the given username already exists
        user = yield User_1.default.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User with that username already exists.' });
        }
        // Create a new user instance (password hashing happens in User model's pre-save hook)
        user = new User_1.default({
            username,
            email,
            password // Mongoose pre-save hook will hash this password
        });
        // Save the new user to the database
        yield user.save();
        // Respond with success message (avoid sending password back)
        return res.status(201).json({ message: 'User registered successfully!', userId: user._id, username: user.username, email: user.email });
    }
    catch (error) {
        // Handle validation errors from Mongoose or other unexpected errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error during registration.' });
    }
})));
// --- POST /api/login - User login endpoint ---
router.post('/login', (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 1. Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    // 2. Find user by email
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        // Return a generic error for security (don't reveal if email exists)
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // 3. Compare provided password with hashed password
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // 4. Generate JWT
    // You need a JWT Secret. Add this to your .env file!
    // Example: JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET is not defined in .env');
        return res.status(500).json({ message: 'Server configuration error.' });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, // Payload: what information to store in the token
    jwtSecret, // Your secret key
    { expiresIn: '1h' } // Token expires in 1 hour
    );
    // 5. Send success response with token and user info
    return res.status(200).json({
        message: 'Logged in successfully!',
        token,
        userId: user._id,
        username: user.username,
        email: user.email,
    });
})));
// --- POST /api/logout - User logout endpoint ---
// Add 'async' keyword to make it return a Promise, satisfying catchAsync's type.
router.post('/logout', (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // For a JWT-based system, logout is mostly client-side by discarding the token.
    // This endpoint primarily confirms the action and can be expanded later for
    // refresh token invalidation or token blacklisting if needed.
    return res.status(200).json({ message: 'Logged out successfully.' });
})));
exports.default = router;
