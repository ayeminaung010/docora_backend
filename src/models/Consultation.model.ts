import { Document, model, Schema, Types } from "mongoose";

export interface IConsultation extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  // scheduleId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  consultationType: string;
  status: string;
  notes: string;
  prescription: Object;
  advice?: string;
}

const consultationSchema = new Schema<IConsultation>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IConsultation, value: Date) {
          // Ensure startTime is not in the past (optional)
          return value >= new Date();
        },
        message: "Start time cannot be in the past",
      },
    },

    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IConsultation, value: Date) {
          // Ensure endTime is after startTime
          return value > this.startTime;
        },
        message: "End time must be after start time",
      },
    },
    consultationType: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      required: true,
      trim: true,
    },
    prescription: {
      type: Object,
      required: true,
    },
    advice: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Consultation = model<IConsultation>(
  "Consultation",
  consultationSchema
);
