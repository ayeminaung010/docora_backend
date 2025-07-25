import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { runUserMigration } from "./userMigration.js";
import { connectDB } from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("MONGO DB Connection failed !!! ", err);
  });

runUserMigration();