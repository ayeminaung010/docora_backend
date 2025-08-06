import { model, Schema, Types } from "mongoose";

const timeSlotSchema = new Schema(
  {
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isBooked: { type: Boolean, default: false, required: true },
    disabled: { type: Boolean, default: false, required: true },
  },
  { _id: false }
);

export interface ITimeSlot extends Types.Subdocument {
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  disabled: boolean;
}

export interface ISchedule extends Document {
  _id: Types.ObjectId;
  doctorId: Types.ObjectId;
  date: Date;
  fullTimeSlots: ITimeSlot[];
}
const scheduleSchema = new Schema<ISchedule>({
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  date: {
    type: Date,
    required: true,
  },
  fullTimeSlots: {
    type: [timeSlotSchema],
    required: true,
  },
});

export const Schedule = model<ISchedule>("Schedule", scheduleSchema);
