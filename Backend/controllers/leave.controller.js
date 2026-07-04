import Leave from "../modules/leave.module.js";
import Attendance from "../modules/attendance.module.js";

const eachDate = (fromDate, toDate) => {
  const dates = [];
  const cursor = new Date(fromDate);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(toDate);
  end.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
};

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("employee", "employeeId name email department designation")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, remarks } = req.body;

    if (!leaveType || !fromDate || !toDate) {
      return res.status(400).json({ success: false, message: "Leave type and date range are required" });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({ success: false, message: "From date cannot be after to date" });
    }

    const leave = await Leave.create({
      employee: req.user.id,
      leaveType,
      fromDate,
      toDate,
      remarks,
    });

    res.status(201).json({ success: true, message: "Leave request submitted", leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Approved or Rejected" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, adminComment },
      { new: true, runValidators: true }
    ).populate("employee", "employeeId name email department designation");

    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave request not found" });
    }

    if (status === "Approved") {
      await Promise.all(
        eachDate(leave.fromDate, leave.toDate).map((date) => {
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);

          return Attendance.findOneAndUpdate(
            {
              employee: leave.employee._id,
              date: { $gte: date, $lte: dayEnd },
            },
            {
              employee: leave.employee._id,
              date,
              status: "Leave",
            },
            { upsert: true, new: true }
          );
        })
      );
    }

    res.status(200).json({ success: true, message: `Leave ${status.toLowerCase()}`, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findOneAndDelete({
      _id: req.params.id,
      employee: req.user.id,
      status: "Pending",
    });

    if (!leave) {
      return res.status(404).json({ success: false, message: "Pending leave request not found" });
    }

    res.status(200).json({ success: true, message: "Leave request cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
