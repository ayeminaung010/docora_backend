import mongoose from "mongoose";
import { Consultation } from "../models/Consultation.model";
import { Schedule } from "../models/Schedule.model";
import { ApiError } from "../utils/ApiError";

export interface CreateConsultationRequest {
  startTime: Date;
  endTime: Date;
  date: Date;
  consultationType: string;
  status: string;
  medications?: string[]; // consultNotes
  notes?: string;
  advice?: string;
  symptoms: string;
  duration: string;
  currentMedications: string[]; // healthConcerns
  attachments: string[];
}

export enum ConsultationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
export class ConsultationService {
  static async createConsultation(
    userId: string,
    doctorId: string,
    req: CreateConsultationRequest
  ) {
    const session = await mongoose.startSession();

    session.startTransaction();
    try {
      const requestDate = new Date(req.date);

      // 1. Create the start of the day in UTC
      const startOfDay = new Date(requestDate);
      startOfDay.setUTCHours(0, 0, 0, 0);

      // 2. Create the end of the day (which is the start of the next day)
      const endOfDay = new Date(startOfDay);

      endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

      const updatedSchedule = await Schedule.findOneAndUpdate(
        {
          doctorId: doctorId,
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          fullTimeSlots: {
            $elemMatch: {
              startTime: req.startTime,
              isBooked: false,
              disabled: false,
            },
          },
        },
        {
          $set: {
            "fullTimeSlots.$.isBooked": true,
            "fullTimeSlots.$.disabled": true,
          },
        }
      );

      if (!updatedSchedule) {
        throw new ApiError(
          409,
          "This time slot is not available or has already been booked."
        );
      }

      // collect the data from the request
      const healthConcern = {
        symptoms: req.symptoms,
        duration: req.duration,
        medications: req.currentMedications,
        attachments: req.attachments,
      };
      const consultation = await Consultation.create({
        patientId: userId,
        doctorId: doctorId,
        scheduleId: updatedSchedule?._id,
        startTime: req.startTime,
        consultationType: req.consultationType,
        status: ConsultationStatus.PENDING,
        healthConcerns: healthConcern,
      });

      return consultation;
    } catch (error: any) {
      await session.abortTransaction();
      throw new ApiError(
        500,
        "Failed to create consultation: " + (error?.message || "Unknown error")
      );
    } finally {
      session.endSession();
    }
  }

  static async endConsultation(id: string) {
    const updateConsultation = await Consultation.findByIdAndUpdate(id, {
      $set: {
        endTime: new Date(),
        status: ConsultationStatus.COMPLETED,
      },
    });

    if (!updateConsultation) {
      throw new ApiError(404, "Consultation not found");
    }

    return updateConsultation;
  }
  static async addNoteToConsultation(
    id: string,
    req: CreateConsultationRequest
  ) {
    const updateConsultation = await Consultation.findByIdAndUpdate(id, {
      $push: {
        consultNotes: {
          medications: req.medications,
          notes: req.notes,
          advice: req.advice,
          createdAt: new Date(),
        },
      },
    });

    if (!updateConsultation) {
      throw new ApiError(404, "Consultation not found");
    }

    return updateConsultation;
  }
}
