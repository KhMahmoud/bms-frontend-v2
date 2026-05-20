import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff_0%,#f6f8fc_42%,#f3f6fb_100%)] p-3 md:p-4">
      <div className="mx-auto grid max-w-[1520px] gap-5 lg:grid-cols-[292px_minmax(0,1fr)]">
        <div className="self-start lg:sticky lg:top-4">
          <Sidebar />
        </div>
        <main className="min-w-0 flex-1 pb-10 pt-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
