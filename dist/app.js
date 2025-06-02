"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db")); // Import the database connection function
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Import your authentication routes
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001; // Define the port for your server
// Connect to the database
(0, db_1.default)();
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
// Define API routes
// All routes in authRoutes will be prefixed with /api
app.use('/api', authRoutes_1.default);
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
