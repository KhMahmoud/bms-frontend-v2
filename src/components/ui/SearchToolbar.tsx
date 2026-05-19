import type { ReactNode } from "react";

export function SearchToolbar({
  search,
  onSearchChange,
  filters,
  actions,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filters?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="glass-panel rounded-xl p-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="ابحث..."
            className="form-input h-10 flex-1 rounded-lg px-3.5 text-sm"
          />
          {filters ? <div className="flex flex-wrap gap-3">{filters}</div> : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
