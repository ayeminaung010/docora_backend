import { Types } from "mongoose";
import { userRole } from "../enum/userRole";
import { Doctor } from "../models/Doctor.model";
import { Patient } from "../models/Patient.model";
import { Review } from "../models/Review.model";
import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";

export interface detailFormRequest {
  bloodType: string;
  allergies?: string[];
  chronicConditions?: string[];
  // currentMedications?: string[];
  gender?: string;
  dateOfBirth?: Date;
}
export interface updatePatientRequest {
  name?: string;
  profile_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
  age?: number;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
}
export interface reviewRequest {
  doctorId: Types.ObjectId;
  consultationId?: Types.ObjectId;
  rating: number;
  comment?: string;
  reviewTags: string[];
}

export class PatientService {
  static async getProfilePatient(userId: string): Promise<any> {
    const [user, patient] = await Promise.all([
      User.findById(userId),
      Patient.findOne({ userId }),
    ]);
    if (!patient && !user) {
      throw new ApiError(404, "Patient data not found");
    }
    // console.log("User found:", user);
    // console.log("Patient found:", patient);
    const userData = {
      name: user?.name,
      profileUrl: user?.profileUrl,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      address: user?.address,
      dateOfBirth: user?.dateOfBirth,
      gender: user?.gender,
      age: user?.age,
      verifyEmail: user?.verifyEmail,
      bloodType: patient?.bloodType,
      allergies: patient?.allergies,
      chronicConditions: patient?.chronicConditions,
      currentMedications: patient?.currentMedications,
    };
    return userData;
  }

  static async patientDetailForm(
    userId: string,
    req: detailFormRequest
  ): Promise<any> {
    const existPatient = await Patient.findOne({ userId });
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (existPatient) {
      throw new ApiError(403, "Patient data already submitted");
    }

    user.dateOfBirth = req.dateOfBirth;
    if (req.dateOfBirth) {
      const age =
        new Date().getFullYear() - new Date(req.dateOfBirth).getFullYear();
      user.age = age;
    }
    user.role = userRole.PATIENT;
    user.gender = req.gender;

    const newPatient = new Patient({
      userId: userId,
      bloodType: req.bloodType,
      allergies: req.allergies,
      chronicConditions: req.chronicConditions,
    });

    const updateUser = await user.save();
    const savedPatient = await newPatient.save();

    return { patient: savedPatient, user: updateUser };
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
      profileData?.dateOfBirth ||
      profileData?.gender ||
      profileData?.age
    ) {
      if (profileData.name) user.name = profileData.name;
      if (profileData.email) {
        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email: profileData.email });
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new ApiError(400, "Email is already in use");
        }
        user.email = profileData.email;
        user.verifyEmail = false;
      }
      if (profileData.phone) user.phoneNumber = profileData.phone;
      if (profileData.address) user.address = profileData.address;
      if (profileData.dateOfBirth) {
        user.dateOfBirth = profileData.dateOfBirth;

        // Recalculate age from dateOfBirth
        const today = new Date();
        const birthDate = new Date(profileData.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        user.age = age;
      }
      if (profileData.gender) user.gender = profileData.gender;
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
  static async popularDoctors(limit: number = 10): Promise<any> {
    const doctors = await Doctor.find({
      isVerified: true,
      userId: { $ne: null },
    })
      .populate({
        path: "userId",
        select: "name profileUrl",
        options: { lean: true },
      })
      .sort({ averageRating: -1, yearsOfExperience: -1 })
      .limit(limit)
      .select("specialty averageRating yearsOfExperience userId")
      .lean();

    return doctors.map((doctor: any) => ({
      _id: doctor._id,
      userId: doctor.userId,
      specialty: doctor.specialty,
      averageRating: doctor.averageRating,
      yearsOfExperience: doctor.yearsOfExperience ?? null,
      name: doctor.userId?.name ?? null,
      profileUrl: doctor.userId?.profileUrl ?? null,
    }));
  }

 static async filterDoctorBySpecialty(givenSpecialty: String): Promise<any> {
    const resultDoctors = await Doctor.find({
      specialty: new RegExp(`^${givenSpecialty}$`, "i"),
    })
      .populate("userId", "name profileUrl")
      .sort({ averageRating: -1 })
      .select("specialty averageRating yearsOfExperience")
      .lean();

    // Map the results to match the popularDoctors data structure
    return resultDoctors.map((doctor: any) => ({
      _id: doctor._id,
      specialty: doctor.specialty,
      averageRating: doctor.averageRating,
      yearsOfExperience: doctor.yearsOfExperience ?? null,
      name: doctor.userId?.name ?? null,
      profileUrl: doctor.userId?.profileUrl ?? null,
    }));
}

  // Add these functions to your PatientService class

  static async searchDoctorsByName(searchTerm: string): Promise<any> {
    const doctors = await Doctor.find({ isVerified: true })
      .populate({
        path: "userId",
        match: {
          name: new RegExp(searchTerm, "i"),
        },
        select: "name profileUrl",
      })
      .sort({ averageRating: -1, yearsOfExperience: -1 })
      .select("specialty averageRating")
      .lean();

    const filteredDoctors = doctors.filter((doctor) => doctor.userId !== null);

    return filteredDoctors;
  }

  static async searchDoctorsByNameAndSpecialty(
    searchTerm: string,
    specialty: string
  ): Promise<any> {
    const doctors = await Doctor.find({
      isVerified: true,
      specialty: new RegExp(`^${specialty}$`, "i"),
    })
      .populate({
        path: "userId",
        match: {
          name: new RegExp(searchTerm, "i"),
        },
        select: "name profileUrl",
      })
      .sort({ averageRating: -1, yearsOfExperience: -1 })
      .select("specialty averageRating")
      .lean();

    // Filter out doctors where userId is null (no name match)
    const filteredDoctors = doctors.filter((doctor) => doctor.userId !== null);

    return filteredDoctors;
  }

  static async getDoctorDetails(
    userId: string,
    doctorId: string
  ): Promise<any> {
    const [userDetails, doctorDetails] = await Promise.all([
      User.findById(doctorId).select("-password").lean(),
      Doctor.findOne({ userId: doctorId }).lean(),
    ]);


    if (!userDetails) {
      throw new ApiError(404, "Doctor not found");
    }
    if (!doctorDetails) {
      throw new ApiError(404, "Doctor details not found");
    }

    const doctorData = {
      name: userDetails.name,
      profileUrl: userDetails.profileUrl,
      workPlace: doctorDetails.workPlace,
      graduateSchool: doctorDetails.graduateSchool,
      specialty: doctorDetails.specialty,
      yearsOfExperience: doctorDetails.yearsOfExperience,
      averageRating: doctorDetails.averageRating,
      consultationType: doctorDetails.consultationType,
    };

    return doctorData;
  }

  static async giveDoctorReview(
    userId: string,
    req: reviewRequest
  ): Promise<any> {
    if (!userId) {
      throw new ApiError(404, "Patient not found");
    }
    const patient = await Patient.findOne({ userId: userId });
    if (!patient) {
      throw new ApiError(404, "Patient not found");
    }

    const reviewDetails = {
      doctorId: req.doctorId,
      consultationId: req.consultationId,
      patientId: userId,
      rating: req.rating,
      comment: req.comment,
      reviewTags: req.reviewTags,
      createdAt: new Date(),
    };

    await new Review(reviewDetails).save();
    return true;
  }
}
