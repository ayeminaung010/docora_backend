import { Consultation, IConsultation } from "../models/Consultation.model"
import { ApiError } from "../utils/ApiError";

export interface CreateConsultationRequest{
    startTime: Date,
    endTime: Date,
    consultationType: string,
    status: string,
    notes?: string,
    prescription?: object,
    advice?: string
}

export enum ConsultationStatus{
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export class ConsultationService{
    static async createConsulatation(userId: string, doctorId: string , req: CreateConsultationRequest){
        const consulatation = await Consultation.create({
            userId : userId,
            doctorId: doctorId,
            startTime: req.startTime,
            // endTime: req.endTime,
            consultationType: req.consultationType,
            status: ConsultationStatus.PENDING,
        });

        return consulatation;
    }

    static async updateConsultation(id: string, req: CreateConsultationRequest){
        const consultation : IConsultation | null = await Consultation.findById(id).lean();
        if(!consultation){
            throw new ApiError(400,"No consultation found");
        }
        consultation.endTime = req.endTime;
        consultation.consultationType = req.consultationType;
        consultation.status = req.status;
        consultation.notes = req.notes;
        consultation.prescription = req.prescription;
        consultation.advice = req.advice;
        await consultation.save();
        return consultation;
    }
}