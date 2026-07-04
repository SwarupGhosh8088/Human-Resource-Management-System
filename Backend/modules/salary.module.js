import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    basic: {
      type: Number,
      default: 0,
    },

    hra: {
      type: Number,
      default: 0,
    },

    allowances: {
      type: Number,
      default: 0,
    },

    deductions: {
      type: Number,
      default: 0,
    },

    ctc: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
