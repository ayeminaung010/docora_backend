import mongoose, { Types } from "mongoose";
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

  static async getUpcomingConsultations(userId: string) {
    const startToday = new Date();
    startToday.setUTCHours(0, 0, 0, 0);

    // const endToday = new Date(startToday);
    // endToday.setUTCHours(23, 59, 59, 999);

    const patientObjectId = new Types.ObjectId(userId);

    const upcomingConsultations = await Consultation.aggregate([
      {
        $match: {
          patientId: patientObjectId,
          status: ConsultationStatus.PENDING,
          startTime: {
            $gte: startToday,
            // $lt: endToday,
          },
        },
      },
      {
          $lookup: {
              from: "users", // The actual name of the users collection in MongoDB
              localField: "doctorId",
              foreignField: "_id",
              as: "userDoc" // A temporary array to hold the found user document
          }
      },
      {
          $lookup: {
              from: "doctors", // The actual name of the doctors collection
              localField: "doctorId",
              foreignField: "userId", 
              as: "doctorDoc" // A temporary array for the doctor document
          }
      },
      {
          $unwind: { path: "$userDoc", preserveNullAndEmptyArrays: true }
      },
      {
          $unwind: { path: "$doctorDoc", preserveNullAndEmptyArrays: true }
      },
      {
          $project: {
              // Include the consultation fields you want
              _id: 1,
              startTime: 1,
              consultationType: 1,
              status: 1,

              // Create the 'doctorDetails' object by merging fields from the lookups
              doctorDetails: {
                  name: "$userDoc.name",
                  profileUrl: "$userDoc.profileUrl",
                  // workPlace: "$doctorDoc.workPlace",
                  // graduateSchool: "$doctorDoc.graduateSchool",
                  speciality: "$doctorDoc.speciality",
                  yearsOfExperience: "$doctorDoc.yearsOfExperience",
                  averageRating: "$doctorDoc.averageRating",
              }
          }
      }
    ]);

    if (!upcomingConsultations || upcomingConsultations.length === 0) {
      throw new ApiError(404, "No upcoming consultations found");
    }

    return upcomingConsultations;
  }

  static async getPastConsultations(userId: string) {
    //test with current date to next 3 days
    const startToday = new Date();
    startToday.setUTCHours(0, 0, 0, 0);

    const patientObjectId = new Types.ObjectId(userId);

    const pastConsultations = await Consultation.aggregate([
      {
        $match: {
          patientId: patientObjectId,
          status: ConsultationStatus.COMPLETED || ConsultationStatus.CANCELLED,
          startTime: {
            $lt: startToday,
          },
        },
      },
      {
          $lookup: {
              from: "users",
              localField: "doctorId",
              foreignField: "_id",
              as: "userDoc"
          }
      },
      {
          $lookup: {
              from: "doctors",
              localField: "doctorId",
              foreignField: "userId", 
              as: "doctorDoc"
          }
      },
      {
          $unwind: { path: "$userDoc", preserveNullAndEmptyArrays: true }
      },
      {
          $unwind: { path: "$doctorDoc", preserveNullAndEmptyArrays: true }
      },
      {
          $project: {
              _id: 1,
              startTime: 1,
              consultationType: 1,
              status: 1,
              consultNotes: 1,

              doctorDetails: {
                  name: "$userDoc.name",
                  profileUrl: "$userDoc.profileUrl",
                  speciality: "$doctorDoc.speciality",
                  yearsOfExperience: "$doctorDoc.yearsOfExperience",
                  averageRating: "$doctorDoc.averageRating",
              }
          }
      }
    ]);

    if (!pastConsultations || pastConsultations.length === 0) {
      throw new ApiError(404, "No past consultations found");
    }

    return pastConsultations;
  }


  static async getUpcomingConsultationsForDoctor(doctorId: string) {
    const startToday = new Date();
    startToday.setUTCHours(0, 0, 0, 0);

    // const endToday = new Date(startToday);
    // endToday.setUTCHours(23, 59, 59, 999);

    const doctorObjectId = new Types.ObjectId(doctorId);

    const upcomingConsultations = await Consultation.aggregate([
      {
        $match: {
          doctorId: doctorObjectId,
          status: ConsultationStatus.PENDING,
          startTime: {
            $gte: startToday,
            // $lt: endToday,
          },
        },
      },
      {
          $lookup: {
              from: "users",
              localField: "patientId",
              foreignField: "_id",
              as: "userDoc"
          }
      },
      {
          $unwind: { path: "$userDoc", preserveNullAndEmptyArrays: true }
      },
      {
          $project: {
              _id: 1,
              startTime: 1,
              consultationType: 1,
              status: 1,

              patientDetails: {
                  name: "$userDoc.name",
                  profileUrl: "$userDoc.profileUrl",
                  age: "$userDoc.age",
                  gender: "$userDoc.gender",
              }
          }
      }
    ]);

    if (!upcomingConsultations || upcomingConsultations.length === 0) {
      throw new ApiError(404, "No upcoming consultations found");
    }

    return upcomingConsultations;
  }

  static async getPastConsultationsForDoctor(doctorId: string) {
    const startToday = new Date();
    startToday.setUTCHours(0, 0, 0, 0);

    const doctorObjectId = new Types.ObjectId(doctorId);

    const pastConsultations = await Consultation.aggregate([
      {
        $match: {
          doctorId: doctorObjectId,
          status: ConsultationStatus.COMPLETED || ConsultationStatus.CANCELLED,
          startTime: {
            $lt: startToday,
          },
        },
      },
      {
          $lookup: {
              from: "users",
              localField: "patientId",
              foreignField: "_id",
              as: "userDoc"
          }
      },
      {
          $unwind: { path: "$userDoc", preserveNullAndEmptyArrays: true }
      },
      {
          $project: {
              _id: 1,
              startTime: 1,
              consultationType: 1,
              status: 1,
              consultNotes: 1,

              patientDetails: {
                  name: "$userDoc.name",
                  profileUrl: "$userDoc.profileUrl",
                  age: "$userDoc.age",
                  gender: "$userDoc.gender",
              }
          }
      }
    ]);

    if (!pastConsultations || pastConsultations.length === 0) {
      throw new ApiError(404, "No past consultations found");
    }
    return pastConsultations;
  }
}
