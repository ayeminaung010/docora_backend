import mongoose, { Types } from "mongoose";
import { ISchedule, ITimeSlot, Schedule } from "../src/models/Schedule.model";

const timeSlotStrings = [
  "09:00", "09:15", "09:30", "09:45",
  "10:00", "10:15", "10:30", "10:45",
  "11:00", "11:15", "11:30", "11:45",
  "13:00", "13:15", "13:30", "13:45",
  "14:00", "14:15", "14:30", "14:45",
  "15:00", "15:15", "15:30", "15:45",
  "17:00", "17:15", "17:30", "17:45",
  "18:00", "18:15", "18:30", "18:45",
  "19:00", "19:15", "19:30", "19:45",
];

interface ScheduleCreationData {
  doctorId: Types.ObjectId;
  date: Date;
  fullTimeSlots: { // <-- This is just a plain object array
    startTime: Date;
    endTime: Date;
    isBooked: boolean;
    disabled: boolean;
  }[];
}

export const runScheduleSeed = async () => {
  try {
    console.log("Starting schedule seeding process...");

    await Schedule.deleteMany({});
    console.log("Cleared existing schedules.");

    const mockDoctorIds = [new Types.ObjectId(), new Types.ObjectId()];

    // ✅ FIX 2: Use the new, correct interface for the array.
    const schedulesToCreate: ScheduleCreationData[] = [];
    const numberOfDaysToSeed = 5;

    for (const doctorId of mockDoctorIds) {
      for (let i = 0; i < numberOfDaysToSeed; i++) {
        const baseDate = new Date();
        baseDate.setUTCDate(baseDate.getUTCDate() + i);
        baseDate.setUTCHours(0, 0, 0, 0);

        // ✅ FIX 3: Generate startTime and endTime to match your schema.
        const fullTimeSlots  = timeSlotStrings.map((timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);

          // Create the start time for the slot
          const startTime = new Date(baseDate);
          startTime.setUTCHours(hours, minutes);

          // Create the end time (15 minutes after start)
          const endTime = new Date(startTime);
          endTime.setUTCMinutes(endTime.getUTCMinutes() + 15);

          return {
            startTime, // Use the new startTime
            endTime,   // Use the new endTime
            isBooked: false,
            disabled: false,
          };
        });

        // This object now correctly matches the ScheduleCreationData type
        schedulesToCreate.push({
          doctorId,
          date: baseDate,
          fullTimeSlots,
        });
      }
    }

    // Mongoose's insertMany is designed to accept plain JavaScript objects like this.
    const result = await Schedule.insertMany(schedulesToCreate);
    
    console.log(`✅ Success! ${result.length} schedule documents were created.`);

  } catch (err) {
    console.error("❌ Schedule seeding failed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};