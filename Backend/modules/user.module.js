import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Employee"],
      default: "Employee",
    },

    phone: String,
    address: String,
    profilePicture: String,

    department: String,
    designation: String,
    dateOfJoining: Date,

    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpExpires:  Date,

    isLoggedIn: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;