import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  width?: string;
  render: (item: T) => ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  onRowClick,
  rowActionLabel = "تعديل",
}: {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (item: T) => void;
  rowActionLabel?: string;
}) {
  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-right">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={column.width ? { width: column.width } : undefined}
                  className="px-4 py-3 text-xs font-semibold tracking-[0.06em] text-slate-500"
                >
                  {column.header}
                </th>
              ))}
              {onRowClick ? (
                <th className="w-24 px-4 py-3 text-xs font-semibold tracking-[0.06em] text-slate-500">
                  الإجراء
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.map((row, index) => (
              <tr key={index} className="soft-hover transition">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3.5 align-top text-sm text-slate-700">
                    {column.render(row)}
                  </td>
                ))}
                {onRowClick ? (
                  <td className="px-4 py-3.5 align-top">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRowClick(row);
                      }}
                      className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-[#2563EB] transition hover:border-blue-200 hover:bg-blue-100"
                    >
                      {rowActionLabel}
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
