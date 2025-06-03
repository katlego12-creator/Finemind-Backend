"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db")); // Import the database connection function
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // NEW: Import your authentication routes
const cors_1 = __importDefault(require("cors")); // NEW: Import cors for Cross-Origin Resource Sharing
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001; // Define the port for your server (changed to 5001)
// Connect to the database
(0, db_1.default)();
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// NEW: Configure CORS to allow requests from your frontend
app.use((0, cors_1.default)({
    origin: 'http://localhost:8081' // IMPORTANT: Replace with your frontend's actual URL (e.g., for React Native)
    // For general development, you might use '*' temporarily, but be careful in production.
}));
// Define API routes
// All routes in authRoutes will be prefixed with /api
app.use('/api', authRoutes_1.default); // NEW: Use the imported authRoutes for /api path
// Basic route for testing server status
app.get('/', (req, res) => {
    res.send('Finemind Backend API is running!');
});
// --- Add a basic error handling middleware ---
// This middleware catches any errors passed by `next(error)` from your routes
// and sends a generic 500 server error response.
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).send('Something broke!');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the API at http://localhost:${PORT}`);
});
