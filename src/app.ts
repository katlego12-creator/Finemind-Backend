// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db'; // Import the database connection function
import authRoutes from './routes/authRoutes'; // NEW: Import your authentication routes
import { Request, Response, NextFunction } from 'express'; // Import NextFunction for error handling middleware
import cors from 'cors'; // NEW: Import cors for Cross-Origin Resource Sharing

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Define the port for your server (changed to 5001)

// Connect to the database
connectDB();

// Middleware to parse JSON request bodies
app.use(express.json());

// NEW: Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:8081' // IMPORTANT: Replace with your frontend's actual URL (e.g., for React Native)
                                   // For general development, you might use '*' temporarily, but be careful in production.
}));


// Define API routes
// All routes in authRoutes will be prefixed with /api
app.use('/api', authRoutes); // NEW: Use the imported authRoutes for /api path

// Basic route for testing server status
app.get('/', (req: Request, res: Response) => {
  res.send('Finemind Backend API is running!');
});

// --- Add a basic error handling middleware ---
// This middleware catches any errors passed by `next(error)` from your routes
// and sends a generic 500 server error response.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send('Something broke!');
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});