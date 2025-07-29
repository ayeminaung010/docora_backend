import cors from 'cors';
import express from 'express';
import mainRouter from './api/v1/routes/index';

// Create the Express app instance
const app = express();

// --- Middlewares ---

// 1. CORS (Cross-Origin Resource Sharing)
// This allows your frontend (on a different domain) to make requests to your backend.
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

// 2. Built-in Express middleware to parse JSON request bodies
app.use(express.json({ limit: '16kb' }));

// 3. Built-in Express middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// 4. Middleware for serving static files (if you have any, like user avatars)
app.use(express.static('public'));


// --- Simple Test Route ---
// This is just to confirm our server is running correctly.
app.get('/', (req, res) => {
    res.status(200).send('<h1>Hospital Consultation API is running!</h1>');
});


// --- API Routes ---
// We will import and use our main API router here later.
// import router from './api/v1/routes/index.js';
app.use('/api/v1', mainRouter);


// Export the app to be used by the server entrypoint
export default app;