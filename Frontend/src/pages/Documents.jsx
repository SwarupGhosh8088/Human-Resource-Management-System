import React, { useEffect, useRef, useState } from "react";
import { Upload, Download, Trash2, FileText as FileIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import { getMyDocuments, getAllDocuments, uploadDocument, deleteDocument } from "../api/documents.js";

export default function Documents() {
  const { isAdmin } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = isAdmin ? await getAllDocuments() : await getMyDocuments();
      setDocs(res.data?.documents || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isAdmin]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
      await uploadDocument(formData);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(id);
    await load();
  };

  const columns = [
    ...(isAdmin ? [{ key: "employee", header: "Employee", render: (r) => r.employee?.name || r.employee?.employeeId || "—" }] : []),
    {
      key: "name",
      header: "Document",
      render: (r) => (
        <span className="flex items-center gap-2">
          <FileIcon size={15} className="text-slate-400" /> {r.name}
        </span>
      ),
    },
    { key: "uploadedAt", header: "Uploaded", render: (r) => new Date(r.uploadedAt || r.createdAt).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <div className="flex items-center gap-3">
          <a href={r.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-ink transition-colors" aria-label="Download">
            <Download size={15} />
          </a>
          <button onClick={() => handleDelete(r._id)} className="text-slate-400 hover:text-danger-600 transition-colors" aria-label="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title={isAdmin ? "All employee documents" : "My documents"}
        action={
          !isAdmin && (
            <label className="btn-primary text-xs px-3 py-2 cursor-pointer">
              <Upload size={14} /> {uploading ? "Uploading…" : "Upload document"}
              <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )
        }
      >
        {error && <div className="text-sm text-danger-600 bg-danger-50 rounded-md px-3 py-2 mb-4">{error}</div>}
        {loading ? (
          <p className="text-sm text-slate-400 font-mono py-8 text-center">Loading documents…</p>
        ) : (
          <DataTable columns={columns} rows={docs} emptyMessage="No documents uploaded yet." />
        )}
      </Card>
    </div>
  );
}
