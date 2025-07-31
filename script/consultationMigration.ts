import mongoose from "mongoose";
import { Consultation } from "../src/models/Consultation.model";
import { Schedule } from "../src/models/Schedule.model";
import { User } from "../src/models/User.model";
import { faker } from "@faker-js/faker";

const createRandomConsultation = (patientId: string, doctorId: string, scheduleId: string) => {
  const startTime = faker.date.future();
  const consultationType = faker.helpers.arrayElement([
    'Chat',
    'Video',
    'Audio',
  ]);
  
  const status = faker.helpers.arrayElement(['PENDING', 'COMPLETED', 'CANCELLED']);

  return {
    patientId,
    doctorId,
    scheduleId,
    startTime,
    endTime: status === 'COMPLETED' ? faker.date.future({ refDate: startTime }) : undefined,
    consultationType,
    status,
    consultNotes: {
      medications: status === 'COMPLETED' ? faker.helpers.multiple(() => faker.commerce.productName(), { count: { min: 0, max: 3 } }) : [],
      notes: status === 'COMPLETED' ? faker.lorem.paragraph() : undefined,
      advice: status === 'COMPLETED' ? faker.lorem.sentence() : undefined,
      createdAt: new Date(),
    },
    healthConcerns: {
      symptoms: faker.lorem.words(3),
      duration: faker.helpers.arrayElement(['1 day', '3 days', '1 week', '2 weeks', '1 month', '3 months']),
      medications: faker.helpers.multiple(() => faker.commerce.productName(), { count: { min: 0, max: 2 } }),
      attachments: faker.helpers.multiple(() => faker.system.fileName(), { count: { min: 0, max: 2 } }),
    },
  };
};

export const runConsultationMigration = async () => {
  try {
    // Get existing users and schedules from database
    const patients = await User.find({ role: 'PATIENT' }).select('_id');
    const doctors = await User.find({ role: 'DOCTOR' }).select('_id');
    const schedules = await Schedule.find().select('_id doctorId');

    if (patients.length === 0) {
      console.log("No patients found. Please run user migration first.");
      return;
    }

    if (doctors.length === 0) {
      console.log("No doctors found. Please run user migration first.");
      return;
    }

    if (schedules.length === 0) {
      console.log("No schedules found. Please run schedule migration first.");
      return;
    }

    const consultations : Array<ReturnType<typeof createRandomConsultation>> = [];

    // Create 15-20 consultations
    const consultationCount = faker.number.int({ min: 15, max: 20 });

    for (let i = 0; i < consultationCount; i++) {
      const randomPatient = faker.helpers.arrayElement(patients);
      const randomSchedule = faker.helpers.arrayElement(schedules);
      
      const consultation = createRandomConsultation(
        randomPatient._id.toString(),
        randomSchedule.doctorId.toString(),
        randomSchedule._id.toString()
      );

      consultations.push(consultation);
    }

    const result = await Consultation.create(consultations);
    
    console.log(`${result.length} consultations were created successfully.`);
  } catch (err) {
    console.log("Consultation migration failed", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};