import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
  {
    userId: ObjectId,
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
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
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

export const User = model("User", userSchema);
