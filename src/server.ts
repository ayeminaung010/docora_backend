import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/database";
// --- Load Environment Variables ---
// This should be at the very top
dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB Connection failed !!! ", err);
  });

// --- Start the Server ---
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on port: ${PORT}`);
  });
};

app.use((req, res, next) => {
    console.log("👀 Incoming:", req.method, req.url);
    next();
});

// --- Connect to Database and Start Server ---
// We'll wrap the server start in a database connection function
// For now, we can just start it directly.
startServer();
