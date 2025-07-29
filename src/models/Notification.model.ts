import { Document, model, Schema, Types } from "mongoose";

export enum NotificationType {
  NEW_MESSAGE = "NEW_MESSAGE",
  APPOINTMENT_REMINDER = "APPOINTMENT_REMINDER",
  APPOINTMENT_CANCELED = "APPOINTMENT_CANCELED",
  APPOINTMENT_CONFIRMED = "APPOINTMENT_CONFIRMED",
  CALL_STARTED = "CALL_STARTED",
  CALL_ENDED = "CALL_ENDED",
  APPOINTMENT_REMINDER_30M = "APPOINTMENT_REMINDER_30M",
  APPOINTMENT_REMINDER_1H = "APPOINTMENT_REMINDER_1H",
}

export interface INotification extends Document {
  _id: Types.ObjectId;
  notificationId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  body: string;
  isRead: boolean;
  notiType: NotificationType;
  metaData: Record<string, any>;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    notificationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Notification",
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    notiType: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    metaData: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
