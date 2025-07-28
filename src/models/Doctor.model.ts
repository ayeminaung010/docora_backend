import { Document, model, Schema, Types } from "mongoose";

export interface IDoctor extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    speciality: string;
    bio?: string;
    yearsOfExperience: string;
    medicalLicenseNo: string;
    issueCountry: string;
    medicalCertificate: string;
    govermentId: string;
    averageRating?: string;
    workPlace?: string;
    graduateSchool?: string;
    consultationType: object;
}

const doctorSchema = new Schema<IDoctor>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    speciality: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    yearsOfExperience: {
        type: String,
        required: true,
    },
    medicalLicenseNo: {
        type: String,
        required: true,
    },
    issueCountry: {
        type: String,
        required: true,
    },
    medicalCertificate: {
        type: String,
        required: true,
    },
    govermentId: {
        type: String,
        required: true,
    },
    averageRating: {
        type: String,
        default: "0",
    },
    workPlace: {
        type: String,
        trim: true,
    },
    graduateSchool: {
        type: String,
        trim: true,
    },
    consultationType: {
        type: Object,
        default: { "Chat": true, "Video": true, "In-person": true }
    }
});

export const Doctor = model<IDoctor>("Doctor", doctorSchema);
