import {
  Consultation,
} from "../models/Consultation.model";
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
    const healthConcern = {
      symptoms: req.symptoms,
      duration: req.duration,
      medications: req.currentMedications,
      attachments: req.attachments,
    };

    const schedule = await Schedule.findOne({
      doctorId: doctorId,
      date: req.date,
    });

    if (!schedule) {
      throw new ApiError(404, "Schedule not found");
    }

    if (schedule.fullTimeSlots.length === 0) {
      throw new ApiError(400, "No time slots available for this schedule");
    }
    // book logic here 

    const consultation = await Consultation.create({
      userId: userId,
      doctorId: doctorId,
      startTime: req.startTime,
      consultationType: req.consultationType,
      status: ConsultationStatus.PENDING,
      healthConcerns: healthConcern,
    });

    return consultation;
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
