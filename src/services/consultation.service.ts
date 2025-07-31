import mongoose from "mongoose";
import { Consultation } from "../models/Consultation.model";
import { Schedule } from "../models/Schedule.model";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User.model";

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
    try{
      const updatedSchedule = await Schedule.findOneAndUpdate(
        {
          doctorId: doctorId,
          date: req.date,
          "fullTimeSlots.startTime": req.startTime,
          "fullTimeSlots.isBooked": false,
        },
        {
          $set: { "fullTimeSlots.$.isBooked": true },
        }
      );
      if (!updatedSchedule) {
        throw new ApiError(
          409,
          "This time slot is not available or already booked."
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
        userId: userId,
        doctorId: doctorId,
        startTime: req.startTime,
        consultationType: req.consultationType,
        status: ConsultationStatus.PENDING,
        healthConcerns: healthConcern,
      });

      return consultation;
    }catch(error) {
      await session.abortTransaction();
      throw new ApiError(500, "Failed to create consultation: " + (error || "Unknown error"));
    }finally{
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

  static async viewConsultation(userId: string,doctorId: string): Promise<any>{


     const [consultationData, userDetails] = await Promise.all([
          Consultation.findOne({patientId: userId, doctorId: doctorId}).lean(), 
          User.findOne({_id: userId}).select("-password").lean(),
        ]);
    
        if (!userDetails) {
          throw new ApiError(404, "user not find");
        }
        if (!consultationData) {
          throw new ApiError(404, "Patient details not found");
        }
        // const consultationHistory = await Consultation.find({ patientId }).lean();
        const consultationDetail = {
          name: userDetails.name,
          profileUrl: userDetails.profileUrl,
          gender: userDetails.gender,
          age: userDetails.age,
          medications: consultationData.consultNotes.medications,
          notes: consultationData.consultNotes.notes,
          advice: consultationData.consultNotes.advice
        };
        return consultationDetail;


  
  }
}
