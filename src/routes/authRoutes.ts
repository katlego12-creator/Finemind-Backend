// src/routes/authRoutes.ts
import { Router, Request, Response, NextFunction } from 'express'; // ADD NextFunction here
import User from '../models/User'; // Import the User model
import catchAsync from '../utils/catchAsync'; // Import the catchAsync utility
import bcrypt from 'bcrypt'; // Import bcrypt for password comparison
import jwt from 'jsonwebtoken'; // Import jsonwebtoken for JWT generation

const router = Router();

// --- POST /api/register - User registration endpoint ---
router.post(
  '/register',
  catchAsync(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields: username, email, and password.' });
    }

    try {
      // Check if a user with the given email already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User with that email already exists.' });
      }

      // Check if a user with the given username already exists
      user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ message: 'User with that username already exists.' });
      }

      // Create a new user instance (password hashing happens in User model's pre-save hook)
      user = new User({
        username,
        email,
        password // Mongoose pre-save hook will hash this password
      });

      // Save the new user to the database
      await user.save();

      // Respond with success message (avoid sending password back)
      return res.status(201).json({ message: 'User registered successfully!', userId: user._id, username: user.username, email: user.email });

    } catch (error: any) {
      // Handle validation errors from Mongoose or other unexpected errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Server error during registration.' });
    }
  })
);

// --- POST /api/login - User login endpoint ---
router.post('/login', catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  // 2. Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    // Return a generic error for security (don't reveal if email exists)
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // 3. Compare provided password with hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
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

  const token = jwt.sign(
    { userId: user._id, email: user.email }, // Payload: what information to store in the token
    jwtSecret,                               // Your secret key
    { expiresIn: '1h' }                     // Token expires in 1 hour
  );

  // 5. Send success response with token and user info
  return res.status(200).json({
    message: 'Logged in successfully!',
    token,
    userId: user._id,
    username: user.username,
    email: user.email,
  });
}));

// --- POST /api/logout - User logout endpoint ---
// Add 'async' keyword to make it return a Promise, satisfying catchAsync's type.
router.post('/logout', catchAsync(async (req: Request, res: Response) => { // ADD async here
  // For a JWT-based system, logout is mostly client-side by discarding the token.
  // This endpoint primarily confirms the action and can be expanded later for
  // refresh token invalidation or token blacklisting if needed.
  return res.status(200).json({ message: 'Logged out successfully.' });
}));

export default router;