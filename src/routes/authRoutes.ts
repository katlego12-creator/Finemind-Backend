// src/routes/authRoutes.ts
import { Router, Request, Response } from 'express';
import User from '../models/User'; // Import the User model
import catchAsync from '../utils/catchAsync'; // Import the catchAsync utility

const router = Router();

// POST /api/register - User registration endpoint
// Wrap the async handler with catchAsync to ensure proper error handling and type inference
router.post(
  '/register',
  catchAsync(async (req: Request, res: Response) => {
    const { username, email, password } = req.body; // Extract data from the request body

    // Basic validation
    if (!username || !email || !password) {
      // IMPORTANT: Add 'return' here to explicitly end the function execution after sending response
      return res.status(400).json({ message: 'Please enter all required fields: username, email, and password.' });
    }

    try {
      // Check if a user with the given email already exists
      let user = await User.findOne({ email });
      if (user) {
        // IMPORTANT: Add 'return' here
        return res.status(400).json({ message: 'User with that email already exists.' });
      }

      // Check if a user with the given username already exists
      user = await User.findOne({ username });
      if (user) {
        // IMPORTANT: Add 'return' here
        return res.status(400).json({ message: 'User with that username already exists.' });
      }

      // Create a new user instance
      user = new User({
        username,
        email,
        password // Mongoose pre-save hook will hash this password
      });

      // Save the new user to the database
      await user.save();

      // Respond with success message (avoid sending password back)
      // IMPORTANT: Add 'return' here
      return res.status(201).json({ message: 'User registered successfully!', userId: user._id, username: user.username, email: user.email });

    } catch (error: any) {
      // Handle validation errors from Mongoose or other unexpected errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        // IMPORTANT: Add 'return' here
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      console.error('Registration error:', error);
      // IMPORTANT: Add 'return' here
      return res.status(500).json({ message: 'Server error during registration.' });
    }
  })
);

export default router;