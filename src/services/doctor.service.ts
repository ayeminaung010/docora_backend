import { Doctor } from "../models/Doctor.model";
import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiError";

export interface VerifyIdentitiyRequest {
  medicalLicenseNo: string;
  issueCountry: string;
  speciality: string;
  yearsOfExperience: string;
  medicalCertificate: string;
  govermentId: string;
}

export class DoctorService {
  static async verifyIdentity(userId: string, req: VerifyIdentitiyRequest): Promise<any> {
    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      throw new ApiError(403, "You already submitted your identities");
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if(user.role !== "DOCTOR") {
        user.role = "DOCTOR"; 
        await user.save();
    } //update role in user model
    

    // Create a new doctor entry
    const doctorDetails = {
      userId: userId,
      medicalLicenseNo: req.medicalLicenseNo,
      issueCountry: req.issueCountry,
      speciality: req.speciality,
      yearsOfExperience: req.yearsOfExperience,
      medicalCertificate: req.medicalCertificate,
      govermentId: req.govermentId,
      isVerified: true, // Assuming verification is successful becoz we don't have admin panel to approve yet
      submitAt: new Date(),
    };
    
    await new Doctor(doctorDetails).save();

    return true; 
  }
}
