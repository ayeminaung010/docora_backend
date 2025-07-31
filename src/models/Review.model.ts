import { Document,Schema,model, Types } from "mongoose";

export interface IReview extends Document{
    _id: Types.ObjectId;
    consultationId?: Types.ObjectId;
    patientId: Types.ObjectId;
    doctorId: Types.ObjectId;
    rating: number;
    comment?: string;
    reviewTags: string[];
    createdAt: Date;
}

const reviewSchema = new Schema<IReview>({
    consultationId: {
        type: Schema.Types.ObjectId,
        ref: "Consultation",
        // required: true,
        unique: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    rating: {
        type: Number,
        default: 0.0,
        min: 0,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        trim: true,
    },
    reviewTags: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Review = model<IReview>("Review",reviewSchema);