import mongoose from "mongoose";
import { User } from "../src/models/User.model.js";
import { faker } from "@faker-js/faker";

const createRandomUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    // Use a consistent password for easy testing during development
    password: "password123",
    role: faker.helpers.arrayElement(['PATIENT', 'DOCTOR']),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(true),
    gender: faker.person.sex().toUpperCase(),
    dateOfBirth: faker.date.birthdate(),
    age: faker.number.int({ min: 18, max: 70 }),
    profileUrl: faker.image.avatar(),
  };
};


export const runUserMigration = async () => {
  try {
    const users = faker.helpers.multiple(createRandomUser, {
      count: 20,
    });

    const result = await User.create(users);
    
    console.log(`${result.length} users were created successfully.`);
  } catch (err) {
    console.log("migration failed", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};


// const users = [
//   {
//     name: "John Doe",
//     email: "5C6dV@example.com",
//     password: "password123",
//     role: "PATIENT",
//     phoneNumber: "0987654321",
//     address: "123 Main St, Anytown, USA",
//     gender: "MALE",
//     dateOfBirth: "1990-01-01",
//     age: 30,
//   },
//   {
//     name: "Jane Doe",
//     email: "4cKoT@example.com",
//     password: "password123",
//     role: "PATIENT",
//     phoneNumber: "1234567890",
//     address: "123 Main St, Anytown, USA",
//     gender: "FEMALE",
//     dateOfBirth: "1990-01-01",
//     age: 30,
//   },
//   {
//     name: "John Doe",
//     email: "user3@example.com",
//     password: "password123",
//     role: "PATIENT",
//     phoneNumber: "0678901234",
//     address: "123 Main St, Anytown, USA",
//     gender: "MALE",
//     dateOfBirth: "1990-01-01",
//     age: 30,
//   },
// ];