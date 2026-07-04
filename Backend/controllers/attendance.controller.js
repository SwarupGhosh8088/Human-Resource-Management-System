
import Attendance from "../modules/attendance.module.js";

const startOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const buildDateFilter = ({ from, to } = {}) => {
  const date = {};
  if (from) date.$gte = startOfDay(from);
  if (to) date.$lte = endOfDay(to);
  return Object.keys(date).length ? { date } : {};
};

export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find(buildDateFilter(req.query))
      .populate("employee", "employeeId name email department designation")
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({
      employee: req.user.id,
      ...buildDateFilter(req.query),
    }).sort({ date: -1, createdAt: -1 });

    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const now = new Date();
    const existing = await Attendance.findOne({
      employee: req.user.id,
      date: { $gte: startOfDay(now), $lte: endOfDay(now) },
    });

    if (existing?.checkIn) {
      return res.status(400).json({ success: false, message: "Already checked in today" });
    }

    const record =
      existing ||
      new Attendance({
        employee: req.user.id,
        date: startOfDay(now),
        status: "Present",
      });

    record.checkIn = now;
    record.status = "Present";
    await record.save();

    res.status(200).json({ success: true, message: "Checked in successfully", record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const now = new Date();
    const record = await Attendance.findOne({
      employee: req.user.id,
      date: { $gte: startOfDay(now), $lte: endOfDay(now) },
    });

    if (!record?.checkIn) {
      return res.status(400).json({ success: false, message: "Check in before checking out" });
    }

    if (record.checkOut) {
      return res.status(400).json({ success: false, message: "Already checked out today" });
    }

    record.checkOut = now;
    await record.save();

    res.status(200).json({ success: true, message: "Checked out successfully", record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { employee, date, checkIn, checkOut, status = "Present" } = req.body;

    if (!employee || !date) {
      return res.status(400).json({ success: false, message: "Employee and date are required" });
    }

    const record = await Attendance.findOneAndUpdate(
      {
        employee,
        date: { $gte: startOfDay(date), $lte: endOfDay(date) },
      },
      {
        employee,
        date: startOfDay(date),
        checkIn,
        checkOut,
        status,
      },
      { new: true, upsert: true, runValidators: true }
    ).populate("employee", "employeeId name email department designation");

    res.status(200).json({ success: true, message: "Attendance saved", record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("employee", "employeeId name email department designation");

    if (!record) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }

    res.status(200).json({ success: true, message: "Attendance updated", record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
