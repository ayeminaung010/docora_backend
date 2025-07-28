import { Document, model, Schema, Types } from "mongoose";

export interface IPatient extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    bloodType: string;
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: string[];
}

const patientSchema = new Schema<IPatient>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },
    bloodType: {
        type: String,
        required: true,
        enum: ["A","B","O", "AB"],
    },
    allergies: {
        type: [String],
        default: [],
    },
    chronicConditions: {
        type: [String],
        default: [],
    },
    currentMedications: {
        type: [String],
        default: [],
    },
})

export const Patient = model<IPatient>("Patient", patientSchema);