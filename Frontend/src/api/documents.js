import client from "./client.js";

// Inferred from the Document model (employee, name, url, uploadedAt) and the
// fact that multer is a backend dependency, implying multipart uploads.

export const getMyDocuments = () => client.get("/documents/me");

export const getAllDocuments = (params) => client.get("/documents", { params });

export const uploadDocument = (formData) =>
  client.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDocument = (id) => client.delete(`/documents/${id}`);
