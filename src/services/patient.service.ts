  import { Types } from "mongoose";
  import { Patient, IPatient } from "../models/Patient.model";
  import { ApiError } from "../utils/ApiError";
  import { User } from "../models/User.model";
  import { Doctor } from "../models/Doctor.model";
import { Review } from "../models/Review.model";

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
  export interface reviewRequest{
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
      console.log("User found:", user);
      console.log("Patient found:", patient);
      const userData  = {
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
      }
      return userData;
    }

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

    static async popularDoctors(limit: number = 5): Promise<any> {
      const popularDoctors = await Doctor.find({ isVerified: true })
        .populate("userId", "name profileUrl")
        .sort({ averageRating: -1, yearsOfExperience: -1 })
        .limit(limit)
        .select("speciality averageRating")
        .lean();

      return popularDoctors;
    }

    static async filterDoctorBySpecialty(givenSpecialty: String): Promise<any> {
      const resultDoctors = await Doctor.find({
        speciality: new RegExp(`^${givenSpecialty}$`, "i"),
      })
        .populate("userId", "name profileUrl")
        .sort({ averageRating: -1 })
        .select("speciality averageRating")
        .lean();

      return resultDoctors;
    }

    // Add these functions to your PatientService class

static async searchDoctorsByName(searchTerm: string): Promise<any> {
  const doctors = await Doctor.find({ isVerified: true })
    .populate({
      path: "userId",
      match: {
        name: new RegExp(searchTerm, "i")
      },
      select: "name profileUrl"
    })
    .sort({ averageRating: -1, yearsOfExperience: -1 })
    .select("speciality averageRating")
    .lean();

  const filteredDoctors = doctors.filter(doctor => doctor.userId !== null);
  
  return filteredDoctors;
}

static async searchDoctorsByNameAndSpecialty(searchTerm: string, specialty: string): Promise<any> {
  const doctors = await Doctor.find({
    isVerified: true,
    speciality: new RegExp(`^${specialty}$`, "i")
  })
    .populate({
      path: "userId",
      match: {
        name: new RegExp(searchTerm, "i")
      },
      select: "name profileUrl"
    })
    .sort({ averageRating: -1, yearsOfExperience: -1 })
    .select("speciality averageRating")
    .lean();

  // Filter out doctors where userId is null (no name match)
  const filteredDoctors = doctors.filter(doctor => doctor.userId !== null);
  
  return filteredDoctors;
}

static async getDoctorDetails(userId: string, doctorId: string): Promise<any> {
  const [userDetails, doctorDetails] = await Promise.all([
    User.findById(userId).select("-password").lean(), 
    Doctor.findOne({ _id: doctorId }).lean(),
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
    speciality: doctorDetails.speciality,
    yearsOfExperience: doctorDetails.yearsOfExperience,
    averageRating: doctorDetails.averageRating,
    consultationType: doctorDetails.consultationType,
  };
  
  return doctorData;
}

static async giveDoctorReview(userId: string,req: reviewRequest): Promise<any>{
if(!userId){
  throw new ApiError(404, "Patient not found");

}
const patient = await Patient.findOne({userId: userId});
if(!patient){
  throw new ApiError(404, "Patient not found");
}

const reviewDetails={
 doctorId: req.doctorId,
 consultationId: req.consultationId,
 patientId: userId,
rating: req.rating,
comment: req.comment,
reviewTags: req.reviewTags,
createdAt: new Date(),
}

await new Review(reviewDetails).save();
return true;

}


  }
