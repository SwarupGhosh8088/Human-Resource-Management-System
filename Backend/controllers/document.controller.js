import Document from "../modules/document.module.js";

export const getAllDocuments = async (req, res) => {
  try {
    const filter = req.query.employee ? { employee: req.query.employee } : {};
    const documents = await Document.find(filter)
      .populate("employee", "employeeId name email department designation")
      .sort({ uploadedAt: -1 });

    res.status(200).json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ employee: req.user.id }).sort({ uploadedAt: -1 });

    res.status(200).json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const employee = req.user.role === "Admin" && req.body.employee ? req.body.employee : req.user.id;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.url;
    const name = req.body.name || req.file?.originalname;

    if (!name || !fileUrl) {
      return res.status(400).json({ success: false, message: "Document name and file are required" });
    }

    const document = await Document.create({
      employee,
      name,
      url: fileUrl,
    });

    res.status(201).json({ success: true, message: "Document uploaded", document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "Admin") filter.employee = req.user.id;

    const document = await Document.findOneAndDelete(filter);

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.status(200).json({ success: true, message: "Document deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
