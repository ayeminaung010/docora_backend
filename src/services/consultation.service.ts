import { Consultation, IConsultation } from "../models/Consultation.model";
import { Schedule } from "../models/Schedule.model";
import { ApiError } from "../utils/ApiError";

export interface CreateConsultationRequest {
  startTime: Date;
  endTime: Date;
  consultationType: string;
  status: string;
  medications?: string[];
  notes?: string;
  advice?: string;
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
    const consultation = await Consultation.create({
      userId: userId,
      doctorId: doctorId,
      startTime: req.startTime,
      // endTime: req.endTime,
      consultationType: req.consultationType,
      status: ConsultationStatus.PENDING,
    });

    const schedule = await Schedule.findOne({
      doctorId: doctorId,
      date: req.startTime,
    }).lean();

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
