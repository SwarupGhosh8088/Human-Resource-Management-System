import User from "../modules/user.module.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOtpEmail } from "../utils/otpVerification.js";

dotenv.config();


// Register
export const register = async (req, res) => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      role,
      phone,
      address,
      department,
      designation,
      dateOfJoining,
    } = req.body;

    // Check email
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check employee ID
    const employeeExists = await User.findOne({ employeeId });

    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: "Employee ID already exists",
      });
    }

    //password validation

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters long and contain at least one letter and one number.",
      });
    }



    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      employeeId,
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      address,
      department,
      designation,
      dateOfJoining,
    });

    const  otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    await user.save();
    await sendOtpEmail(user.email, otp);

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};








// Login
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.isLoggedIn = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
  

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

