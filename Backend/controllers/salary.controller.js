import Salary from "../modules/salary.module.js";

export const getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate("employee", "employeeId name email department designation")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, salaries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMySalary = async (req, res) => {
  try {
    const salary = await Salary.findOne({ employee: req.user.id }).populate(
      "employee",
      "employeeId name email department designation"
    );

    res.status(200).json({ success: true, salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSalaryByEmployee = async (req, res) => {
  try {
    const salary = await Salary.findOne({ employee: req.params.employeeId }).populate(
      "employee",
      "employeeId name email department designation"
    );

    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }

    res.status(200).json({ success: true, salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const upsertSalary = async (req, res) => {
  try {
    const { employee, basic = 0, hra = 0, allowances = 0, deductions = 0, ctc = 0 } = req.body;

    if (!employee) {
      return res.status(400).json({ success: false, message: "Employee is required" });
    }

    const salary = await Salary.findOneAndUpdate(
      { employee },
      { employee, basic, hra, allowances, deductions, ctc },
      { new: true, upsert: true, runValidators: true }
    ).populate("employee", "employeeId name email department designation");

    res.status(200).json({ success: true, message: "Salary saved", salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("employee", "employeeId name email department designation");

    if (!salary) {
      return res.status(404).json({ success: false, message: "Salary record not found" });
    }

    res.status(200).json({ success: true, message: "Salary updated", salary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
