import dotenv from 'dotenv';
import { connectDB } from '../src/config/database';
import { runUserMigration } from './userMigration';

// --- .env configuration ---
dotenv.config();

connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("MONGO DB Connection failed !!! ", err);
  });

runUserMigration();