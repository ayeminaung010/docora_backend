const dotenv = require('dotenv');
const app = require('./app');
// import connectDB from './config/database.js'; // We will create this file next

// --- Load Environment Variables ---
// This should be at the very top
dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 8000;


// --- Start the Server ---
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port: ${PORT}`);
    });
};

// --- Connect to Database and Start Server ---
// We'll wrap the server start in a database connection function
// For now, we can just start it directly.
startServer();

/*
// This is what it will look like once we have the DB connection file:
connectDB()
.then(() => {
    startServer();
})
.catch((err) => {
    console.log("MONGO DB Connection failed !!! ", err);
});
*/