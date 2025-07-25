import mongoose from "mongoose";
import { User } from "../src/models/User.model.js";

const users = [
  {
    name: "John Doe",
    email: "5C6dV@example.com",
    password: "password123",
    role: "PATIENT",
    phoneNumber: "0987654321",
    address: "123 Main St, Anytown, USA",
    gender: "MALE",
    dateOfBirth: "1990-01-01",
    age: 30,
  },
  {
    name: "Jane Doe",
    email: "4cKoT@example.com",
    password: "password123",
    role: "PATIENT",
    phoneNumber: "1234567890",
    address: "123 Main St, Anytown, USA",
    gender: "FEMALE",
    dateOfBirth: "1990-01-01",
    age: 30,
  },
  {
    name: "John Doe",
    email: "user3@example.com",
    password: "password123",
    role: "PATIENT",
    phoneNumber: "0678901234",
    address: "123 Main St, Anytown, USA",
    gender: "MALE",
    dateOfBirth: "1990-01-01",
    age: 30,
  },
];

export const runUserMigration = async () => {
  try {
    const result = await User.create(users);
    console.log(result);
  } catch (err) {
    console.log("migration failed", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};
