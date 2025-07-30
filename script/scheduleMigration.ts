import { ISchedule } from './../src/models/Schedule.model';
import  mongoose, { Types, InferSchemaType } from "mongoose";
import { Schedule } from "../src/models/Schedule.model"; // Make sure to export scheduleSchema

// The array of time strings
const timeSlotArray = [
  "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM",
  "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
  "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
  "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM",
  "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
  "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM",
  "05:00 PM", "05:15 PM", "05:30 PM", "05:45 PM",
  "06:00 PM", "06:15 PM", "06:30 PM", "06:45 PM",
  "07:00 PM", "07:15 PM", "07:30 PM", "07:45 PM",
];

// ✅ Automatically infer the document type from the Mongoose schema
type ScheduleType = InferSchemaType<ISchedule>;

export const runScheduleSeed = async () => {
  try {
    console.log("Starting schedule seeding process...");

    await Schedule.deleteMany({});
    console.log("Cleared existing schedules.");

    const mockDoctorIds = [new Types.ObjectId(), new Types.ObjectId()];

    const fullTimeSlots = timeSlotArray.map((time) => ({
      time,
      isBooked: false,
      disabled: false,
    }));

    // ✅ Explicitly type the array to prevent the 'never[]' inference
    const schedulesToCreate: ScheduleType[] = [];
    const numberOfDaysToSeed = 5;

    for (const doctorId of mockDoctorIds) {
      for (let i = 0; i < numberOfDaysToSeed; i++) {
        const scheduleDate = new Date();
        scheduleDate.setUTCHours(0, 0, 0, 0);
        scheduleDate.setDate(scheduleDate.getDate() + i);

        schedulesToCreate.push({
          doctorId,
          date: scheduleDate,
          fullTimeSlots,
        });
      }
    }

    const result = await Schedule.insertMany(schedulesToCreate);
    
    console.log(`✅ Success! ${result.length} schedule documents were created.`);

  } catch (err) {
    console.error("❌ Schedule seeding failed:", err);
  }finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};