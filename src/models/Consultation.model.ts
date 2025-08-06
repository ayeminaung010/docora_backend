import { Document, model, Schema, Types } from "mongoose";

export interface INote extends Types.Subdocument {
  medications?: string[];
  notes?: string;
  advice?: string;
  createdAt: Date;
}

export interface IHealthConcerns extends Types.Subdocument {
  symptoms: string;
  duration: string;
  medications: string[];
  attachments: string[];
}

export interface ICancelConsultation extends Types.Subdocument {
  cancelledBy?: Types.ObjectId;
  cancellationReason?: string;
  cancellationType?: "CANCELLED_BY_PATIENT" | "CANCELLED_BY_DOCTOR" | "PATIENT_NO_SHOW" | "DOCTOR_UNAVAILABLE" | "SYSTEM_ERROR" | "OTHER";
}

export interface IConsultation extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  doctorId: Types.ObjectId;
  scheduleId: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  consultationType: string;
  status: string;
  consultNotes: INote;
  healthConcerns: IHealthConcerns;
  cancelConsultation?: ICancelConsultation;
}

const consultationSchema = new Schema<IConsultation>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    scheduleId: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
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
      required: false,
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
      enum: ["PENDING", "COMPLETED", "CANCELLED"],
      trim: true,
    },
    consultNotes: {
      medications: [String],
      notes: String,
      advice: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    healthConcerns: {
      symptoms: String,
      duration: String,
      medications: [String],
      attachments: [String],
    },
    cancelConsultation: {
      cancelledBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      cancellationReason: {
        type: String,
        required: false,
      },
      cancellationType: {
        type: String,
        required: false,
        enum: [
          "CANCELLED_BY_PATIENT",
          "CANCELLED_BY_DOCTOR",
          "PATIENT_NO_SHOW",
          "DOCTOR_UNAVAILABLE",
          "SYSTEM_ERROR",
          "OTHER",
        ],
      },
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
