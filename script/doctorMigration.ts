import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { Doctor } from "../src/models/Doctor.model";
import { User } from "../src/models/User.model";

const medicalSpecialties = [
  'Pediatrician',
  'General Physician',
  'Dermatologist',
  'Dentist',
  'Cardiologist',
  'Psychiatrist',
];

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'India',
  'Brazil',
  'Mexico'
];

const workplaces = [
  'General Hospital',
  'Medical Center',
  'Private Clinic',
  'University Hospital',
  'Community Health Center',
  'Specialty Clinic',
  'Emergency Department',
  'Surgical Center'
];

const graduateSchools = [
  'Harvard Medical School',
  'Johns Hopkins School of Medicine',
  'Stanford University School of Medicine',
  'University of Pennsylvania School of Medicine',
  'Mayo Clinic School of Medicine',
  'University of California San Francisco',
  'Yale School of Medicine',
  'Columbia University College of Physicians',
  'University of Michigan Medical School',
  'Duke University School of Medicine'
];

const createRandomDoctor = (userId: string) => {
  const yearsExp = faker.number.int({ min: 1, max: 30 });
  const specialty = faker.helpers.arrayElement(medicalSpecialties);
  
  return {
    userId: userId,
    medicalLicenseNo: `MD${faker.string.alphanumeric({ length: 8 }).toUpperCase()}`,
    issueCountry: faker.helpers.arrayElement(countries),
    specialty: specialty,
    yearsOfExperience: yearsExp.toString(),
    medicalCertificate: `CERT${faker.string.alphanumeric({ length: 10 }).toUpperCase()}`,
    governmentId: faker.string.alphanumeric({ length: 12 }).toUpperCase(),
    isVerified: faker.datatype.boolean({ probability: 0.8 }), // 80% verified
    submitAt: faker.date.past({ years: 2 }),
    workPlace: faker.helpers.arrayElement(workplaces),
    graduateSchool: faker.helpers.arrayElement(graduateSchools),
  };
};

export const runDoctorMigration = async () => {
  try {
    // Find all users with DOCTOR role
    const doctorUsers = await User.find({ role: 'DOCTOR' });
    
    if (doctorUsers.length === 0) {
      console.log("No doctor users found. Please run user migration first or create some doctor users.");
      return;
    }

    console.log(`Found ${doctorUsers.length} doctor users. Creating doctor profiles...`);

    // Check which doctors already have profiles
    const existingDoctorUserIds = await Doctor.find({}).distinct('userId');
    const existingDoctorUserIdsAsStrings = existingDoctorUserIds.map(id => id.toString());
    const doctorsToCreate = doctorUsers.filter(
      user => !existingDoctorUserIdsAsStrings.includes(user._id.toString())
    );

    if (doctorsToCreate.length === 0) {
      console.log("All doctor users already have doctor profiles.");
      return;
    }

    // Create doctor profiles for users who don't have them
    const doctorProfiles = doctorsToCreate.map(user => 
      createRandomDoctor(user._id.toString())
    );

    const result = await Doctor.create(doctorProfiles);
    
    console.log(`${result.length} doctor profiles were created successfully.`);
    
    // Log some sample data
    console.log("\nSample created doctors:");
    result.slice(0, 3).forEach((doctor, index) => {
      console.log(`${index + 1}. License: ${doctor.medicalLicenseNo}, Specialty: ${doctor.specialty}, Experience: ${doctor.yearsOfExperience} years`);
    });
    
  } catch (err) {
    console.log("Doctor migration failed", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};