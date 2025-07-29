import { Types } from "mongoose";
import { Patient, IPatient } from "../models/Patient.model";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/User.model";

export interface detailFormRequest {
  bloodType: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
}
export interface updatePatientRequest {
  name?: string;
  profile_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  gender?: string;
  age?: number;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
}

export class PatientService {
  static async patientDetailForm(
    userId: string,
    req: detailFormRequest
  ): Promise<any> {
    const existPatient = await Patient.findOne({ userId });

    if (existPatient) {
      throw new ApiError(403, "Patient data already submitted");
    }

    const newPatient = new Patient({
      userId: userId,
      bloodType: req.bloodType,
      allergies: req.allergies,
      chronicConditions: req.chronicConditions,
      currentMedications: req.currentMedications,
    });

    const savedPatient = await newPatient.save();

    return savedPatient;
  }

  static async patientProfileUpdate(
    userId: string,
    profileData: updatePatientRequest
  ): Promise<any> {
    const [user, patient] = await Promise.all([
      User.findById(userId),
      Patient.findOne({ userId }),
    ]);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!patient) {
      throw new ApiError(
        404,
        "Patient data not found. Please submit initial patient details first."
      );
    }

    if (
      profileData?.name ||
      profileData?.profile_url ||
      profileData?.email ||
      profileData?.phone ||
      profileData?.address ||
      profileData?.date_of_birth
    ) {
      if (profileData.name) user.name = profileData.name;
      if (profileData.email) {
        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email: profileData.email });
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new ApiError(400, "Email is already in use ");
        }
        user.email = profileData.email;
        user.verifyEmail = false; 
      }
      if (profileData.phone) user.phoneNumber = profileData.phone;
      if (profileData.address) user.address = profileData.address;
      if (profileData.date_of_birth)
        user.dateOfBirth = profileData.date_of_birth;
      if (profileData.gender) user.gender = profileData.gender;
      if (profileData.age) user.age = profileData.age;
      if (profileData.profile_url) user.profileUrl = profileData.profile_url;

      await user.save();
      return user;
    }

    if (
      profileData.bloodType ||
      profileData.allergies ||
      profileData.chronicConditions ||
      profileData.currentMedications
    ) {
      if (profileData.bloodType) patient.bloodType = profileData.bloodType;
      if (profileData.allergies) patient.allergies = profileData.allergies;
      if (profileData.chronicConditions)
        patient.chronicConditions = profileData.chronicConditions;
      if (profileData.currentMedications)
        patient.currentMedications = profileData.currentMedications;

      await patient.save();
      return patient;
    }
  }
}
