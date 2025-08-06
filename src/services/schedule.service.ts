import { Types } from "mongoose";
import { Schedule } from "../models/Schedule.model";

export class ScheduleService {
  private static readonly FUTURE_DATE_RANGE: number = 7; // Number of days to look ahead

  static async getDoctorSchedule(doctorId: string) {
    const today = new Date(); // from start today and next 7 days
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + ScheduleService.FUTURE_DATE_RANGE); // 7 days from today

    const allSchedules = await Schedule.find({
      doctorId: doctorId,
      date: {
        $gte: today,
        $lte: futureDate,
      },
    })
      .lean()
      .sort({ date: "asc" });

    return allSchedules;
  }

  static async createSchedule(doctorId: string, scheduleData: any) {
    const newSchedule = new Schedule({
      doctorId,
      ...scheduleData,
    });

    await newSchedule.save();
    return newSchedule;
  }
}
