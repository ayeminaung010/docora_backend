import { Document, model, Schema, Types } from "mongoose";

export interface IDoctor extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId; 
    specialty: string;
    bio?: string;
    yearsOfExperience: string;
    medicalLicenseNo: string;
    issueCountry: string;
    medicalCertificate: string;
    governmentId: string;
    averageRating?: number;
    workPlace?: string;
    graduateSchool?: string;
    consultationType: object;
    isVerified?: boolean;
    submitAt?: Date;
}

const doctorSchema = new Schema<IDoctor>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    specialty: {
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
    governmentId: {
        type: String,
        required: true,
    },
    averageRating: {
        type: Number,
        default: 2.5,
        min: 0,
        max: 5,
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
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    submitAt: {
        type: Date,
        default: Date.now
    }
});

export const Doctor = model<IDoctor>("Doctor", doctorSchema);
