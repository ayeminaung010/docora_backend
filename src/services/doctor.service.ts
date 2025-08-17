import { Doctor } from "../models/Doctor.model";
import { Patient } from "../models/Patient.model";
import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";

export interface VerifyIdentitiyRequest {
  medicalLicenseNo: string;
  issueCountry: string;
  specialty: string;
  yearsOfExperience: string;
  medicalCertificate: string;
  governmentId: string;
}

export interface UpdateProfileRequest {
  name?: string;
  profile_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  gender?: string;
  age?: number;
  yearOfExperience?: string;
  specialty?: string;
  workPlace?: string;
  graduateSchool?: string;
}

export interface patientDataReponse {
  name: string;
  email: string;
  phone: string;
  profileUrl: string;
  gender: string;
  address: string;
  age: number;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
}

export class DoctorService {
  static async verifyIdentity(
    userId: string,
    req: VerifyIdentitiyRequest
  ): Promise<any> {
    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      throw new ApiError(403, "You already submitted your identities");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.role !== "DOCTOR") {
      user.role = "DOCTOR";
      await user.save();
    } //update role in user model

    // Create a new doctor entry
    const doctorDetails = {
      userId: userId,
      medicalLicenseNo: req.medicalLicenseNo,
      issueCountry: req.issueCountry,
      specialty: req.specialty,
      yearsOfExperience: req.yearsOfExperience,
      medicalCertificate: req.medicalCertificate,
      governmentId: req.governmentId,
      isVerified: true, // Assuming verification is successful becoz we don't have admin panel to approve yet
      submitAt: new Date(),
    };

    await new Doctor(doctorDetails).save();

    return true;
  }

  static async updateProfile(
    userId: string,
    profileData: UpdateProfileRequest
  ): Promise<any> {
    const [user, doctor] = await Promise.all([
      User.findById(userId),
      Doctor.findOne({ userId }),
    ]);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }
    // Find the doctor by userId
    if (
      profileData?.name ||
      profileData?.profile_url ||
      profileData?.email ||
      profileData?.phone ||
      profileData?.address ||
      profileData?.date_of_birth
    ) {
      // Update user profile
      if (profileData.name) user.name = profileData.name;
      if (profileData.email) {
        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email: profileData.email });
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new ApiError(400, "Email is already in use ");
        }
        user.email = profileData.email;
        user.verifyEmail = false; // Reset email verification status
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
      profileData.specialty ||
      profileData.yearOfExperience ||
      profileData.workPlace ||
      profileData.graduateSchool
    ) {
      // Update doctor profile
      if (profileData.specialty) doctor.specialty = profileData.specialty;
      if (profileData.yearOfExperience)
        doctor.yearsOfExperience = profileData.yearOfExperience;
      if (profileData.workPlace) doctor.workPlace = profileData.workPlace;
      if (profileData.graduateSchool)
        doctor.graduateSchool = profileData.graduateSchool;
      await doctor.save();
      return doctor;
    }
  }

  static async getPatientDetails(
    userId: string,
    patientId: string
  ): Promise<any> {
    const [userDetails, patientDetails] = await Promise.all([
      User.findById(userId).select("-password").lean(),
      Patient.findOne({ userId: patientId }).lean(),
    ]);

    if (!userDetails) {
      throw new ApiError(404, "Patient not found");
    }
    if (!patientDetails) {
      throw new ApiError(404, "Patient details not found");
    }
    // const consultationHistory = await Consultation.find({ patientId }).lean();
    const patientData = {
      name: userDetails.name,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      profileUrl: userDetails.profileUrl,
      gender: userDetails.gender,
      address: userDetails.address,
      age: userDetails.age,
      bloodType: patientDetails.bloodType,
      allergies: patientDetails.allergies,
      chronicConditions: patientDetails.chronicConditions,
      currentMedications: patientDetails.currentMedications,
      // consulationHistory: consultationHistory || [],
    };
    return patientData;
  }

  static async getProfileData(userId: string): Promise<any> {
    const [userDetail, doctorDetail] = await Promise.all([
      User.findById(userId).select("-password").lean(),
      Doctor.findOne({ userId: userId }).lean(),
    ]);

    if (!userDetail) {
      throw new ApiError(404, "User not found");
    }
    if (!doctorDetail) {
      throw new ApiError(404, "User details not found");
    }

    const profileData ={
      name: userDetail.name,
      email: userDetail.email,
      profileUrl: userDetail.profileUrl,
      verifyEmail: userDetail.verifyEmail,
      address: userDetail.address,
      phoneNumber: userDetail.phoneNumber,
      specialty: doctorDetail.specialty,
      workPlace: doctorDetail.workPlace,
      graduateSchool: doctorDetail.graduateSchool,
      yearOfExp: doctorDetail.yearsOfExperience,
        };

    return profileData;
  }
}
