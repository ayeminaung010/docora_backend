import { Types } from "mongoose";
import { Patient, IPatient } from "../models/Patient.model";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User.model";

export interface detailFormRequest {
  userId: Types.ObjectId;
  bloodType: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
}
export interface updatePatientRequest {
  userId: Types.ObjectId;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
}

export class PatientService {
  static async patientDetailForm(req: detailFormRequest) {
    const existUser = await User.findOne({ _id: req.userId });
    const existPatient = await Patient.findOne({ userId: req.userId });

    if (!existUser) {
      throw new ApiError(404, "User doesn't exist");
    }
    if (existPatient) {
      throw new ApiError(403, "Patient data already submitted");
    }
    const newPatient = new Patient({
      userId: req.userId,
      bloodType: req.bloodType,
      allergies: req.allergies,
      chronicConditions: req.chronicConditions,
      currentMedications: req.currentMedications,
    });

    const savedPatient = await newPatient.save();

    return savedPatient;
  }

  static async patientInfoUpdate(req: updatePatientRequest) {
    const existUser = await User.findOne({ _id: req.userId });
    if (!existUser) {
      throw new ApiError(404, "User doesn't exist");
    }

    const existPatient = await Patient.findOne({ userId: req.userId });
    if (!existPatient) {
      throw new ApiError(
        404,
        "Patient data not found. Please submit initial patient details first."
      );
    }

    const updateData: Partial<updatePatientRequest> = {};

    if (req.bloodType !== undefined) {
      updateData.bloodType = req.bloodType;
    }
    if (req.allergies !== undefined) {
      updateData.allergies = req.allergies;
    }
    if (req.chronicConditions !== undefined) {
      updateData.chronicConditions = req.chronicConditions;
    }
    if (req.currentMedications !== undefined) {
      updateData.currentMedications = req.currentMedications;
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPatient) {
      throw new ApiError(500, "Failed to update patient information");
    }

    return updatedPatient;
  }


  
//    static async getPatientInfo(userId: Types.ObjectId) {
//     const existUser = await User.findOne({ _id: userId });
//     if (!existUser) {
//       throw new ApiError(404, "User doesn't exist");
//     }

//     const patientInfo = await Patient.findOne({ userId }).populate('userId', 'name email');
//     if (!patientInfo) {
//       throw new ApiError(404, "Patient data not found");
//     }

//     return patientInfo;
//   }
}
