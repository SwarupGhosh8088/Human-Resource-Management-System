import React from "react";

const MAP = {
  Pending: "stamp-pending",
  Approved: "stamp-approved",
  Rejected: "stamp-rejected",
  Present: "stamp-present",
  Absent: "stamp-absent",
  "Half-day": "stamp-halfday",
  Leave: "stamp-leave",
};

export default function StatusPill({ status }) {
  const cls = MAP[status] || "stamp-halfday";
  return <span className={`stamp ${cls}`}>{status}</span>;
}
