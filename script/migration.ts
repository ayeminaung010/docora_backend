import dotenv from 'dotenv';
import { connectDB } from '../src/config/database';
import { runUserMigration } from './userMigration';
import { runDoctorMigration } from './doctorMigration';
import { runScheduleSeed } from './scheduleMigration';
import { runConsultationMigration } from './consultationMigration';
import mongoose from 'mongoose';

// --- .env configuration ---
dotenv.config();

async function runAllMigrations() {
  try {
    // Connect to database
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully!");

    // Run migrations in sequence (uncomment as needed)
    
    // Step 1: Create users (patients and doctors)
    // console.log("--- Running User Migration ---");
    await runUserMigration();
    
    // Step 2: Create doctors (if separate from users)
    // console.log("--- Running Doctor Migration ---");
    // await runDoctorMigration();
    
    // Step 3: Create schedules (requires doctors to exist)
    // console.log("--- Running Schedule Migration ---");
    // await runScheduleSeed();
    
    // Step 4: Create consultations (requires users and schedules to exist)
    // console.log("--- Running Consultation Migration ---");
    // await runConsultationMigration();

    console.log("All migrations completed successfully!");

  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
}

// Run all migrations
runAllMigrations();