import { Document, model, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

const ObjectId = Schema.ObjectId;

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  verifyEmail: boolean;
  phoneNumber?: string;
  profileUrl?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: string;
  age?: number;
  isCorrectPassword(password:string) : Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR"],
      default: "PATIENT",
    },
    verifyEmail:{
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      // minLength: [8, "Phone number must be at least 8 characters"],
      // maxLength: [15, "Phone number must not exceed 13 characters"],
    },
    profileUrl: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "UNKNOWN"],
    },
    age: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isCorrectPassword = async function(password: string){
  return await bcrypt.compare(password,this.password)
}

export const User = model<IUser>("User", userSchema);
