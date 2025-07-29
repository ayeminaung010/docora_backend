import { model, Schema, Types } from "mongoose";

export interface ISchedule extends Document {
    _id: Types.ObjectId;
    doctorId: Types.ObjectId;
    date: Date;
    fullTimeSlots: string[]; // e.g., ["09:00", "10:00", "11:00"]
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
        type: [String],
        required: true,
    },
})

export const Schedule = model<ISchedule>("Schedule", scheduleSchema);