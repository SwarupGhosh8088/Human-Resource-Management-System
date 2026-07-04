import React from "react";

export default function DataTable({ columns, rows, emptyMessage = "No records yet." }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400 font-mono">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left">
            {columns.map((col) => (
              <th key={col.key} className="pb-3 pr-4 font-medium text-slate-600 uppercase text-xs tracking-wide whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row._id || i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="py-3 pr-4 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
